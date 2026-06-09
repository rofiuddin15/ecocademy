<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Course;
use App\Models\ForumThread;
use App\Models\Milestone;
use App\Models\Project;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EcocademyApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run seeders to set up roles and initial categories
        $this->seed(\Database\Seeders\DatabaseSeeder::class);
    }

    /**
     * Test user registration and login JWT flow.
     */
    public function test_auth_flow()
    {
        // 1. Register a new student
        $registerResponse = $this->postJson('/api/v1/auth/register', [
            'name' => 'Aditya Pratama',
            'email' => 'aditya@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'student',
            'bio' => 'Tertarik pada pengolahan limbah organik.',
        ]);

        $registerResponse->assertStatus(200)
            ->assertJsonStructure([
                'access_token',
                'token_type',
                'expires_in',
                'user' => [
                    'id', 'name', 'email', 'role', 'bio', 'roles'
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'aditya@example.com',
            'role' => 'student'
        ]);

        // 2. Login with credentials
        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => 'aditya@example.com',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJsonStructure(['access_token']);

        $token = $loginResponse->json('access_token');

        // 3. Get profile details using token
        $meResponse = $this->getJson('/api/v1/auth/me', [
            'Authorization' => 'Bearer ' . $token
        ]);

        $meResponse->assertStatus(200)
            ->assertJsonPath('email', 'aditya@example.com');
    }

    /**
     * Test public endpoints.
     */
    public function test_public_endpoints()
    {
        // Categories list
        $response = $this->getJson('/api/v1/categories');
        $response->assertStatus(200)
            ->assertJsonCount(3); // Seeder creates 3 categories

        // Courses list (only published)
        $response = $this->getJson('/api/v1/courses');
        $response->assertStatus(200)
            ->assertJsonCount(14); // Seeder creates 1 published course + 12 dummy + 1 Kewirausahaan PjBL

        // Showcase list (only completed projects)
        $response = $this->getJson('/api/v1/showcase');
        $response->assertStatus(200)
            ->assertJsonCount(0); // No projects are completed yet in seeder (it is 'executing')

        // Forum threads list
        $response = $this->getJson('/api/v1/forum');
        $response->assertStatus(200)
            ->assertJsonCount(1); // Seeder creates 1 thread
    }

    /**
     * Test the full PjBL flow: student starts project, submits files, instructor evaluates with grade & green score.
     */
    public function test_pjbl_learning_and_grading_flow()
    {
        // 1. Get tokens
        $studentToken = $this->getStudentToken();
        $instructorToken = $this->getInstructorToken();

        $course = Course::where('title', 'Pengantar Ekonomi Sirkular')->first();
        $milestone = Milestone::where('course_id', $course->id)->first();

        // 2. Student registers a new project in the course
        $projectResponse = $this->postJson('/api/v1/projects', [
            'course_id' => $course->id,
            'title' => 'Inovasi Panel Surya Untuk UMKM Pengrajin Perak',
            'umkm_name' => 'Silver Jaya',
            'umkm_sector' => 'Craft & Fashion',
        ], [
            'Authorization' => 'Bearer ' . $studentToken
        ]);

        $projectResponse->assertStatus(201)
            ->assertJsonPath('title', 'Inovasi Panel Surya Untuk UMKM Pengrajin Perak')
            ->assertJsonPath('status', 'pending'); // Menunggu persetujuan dosen

        $projectId = $projectResponse->json('id');

        // 3. Student submits the first milestone document
        $submissionResponse = $this->postJson('/api/v1/submissions', [
            'project_id' => $projectId,
            'milestone_id' => $milestone->id,
            'file_url' => 'https://drive.google.com/test-file',
            'student_notes' => 'Berikut draf analisis kebutuhan energi UMKM Silver Jaya.',
        ], [
            'Authorization' => 'Bearer ' . $studentToken
        ]);

        $submissionResponse->assertStatus(201)
            ->assertJsonPath('file_url', 'https://drive.google.com/test-file')
            ->assertJsonPath('student_notes', 'Berikut draf analisis kebutuhan energi UMKM Silver Jaya.');

        $submissionId = $submissionResponse->json('id');

        // 4. Instructor evaluates and grades the submission
        $feedbackResponse = $this->postJson('/api/v1/feedbacks', [
            'submission_id' => $submissionId,
            'grade' => 95.50,
            'green_impact_score' => 5,
            'comments' => 'Sangat detail. Analisis beban listrik dihitung dengan teliti.',
        ], [
            'Authorization' => 'Bearer ' . $instructorToken
        ]);

        $feedbackResponse->assertStatus(201)
            ->assertJsonPath('grade', 95.50)
            ->assertJsonPath('green_impact_score', 5);

        // 5. Instructor marks the project as completed
        $updateProjectResponse = $this->putJson('/api/v1/projects/' . $projectId, [
            'status' => 'completed'
        ], [
            'Authorization' => 'Bearer ' . $instructorToken
        ]);

        $updateProjectResponse->assertStatus(200)
            ->assertJsonPath('status', 'completed');

        // 6. Public Showcase should now list this completed project
        $showcaseResponse = $this->getJson('/api/v1/showcase');
        $showcaseResponse->assertStatus(200)
            ->assertJsonCount(1); // The project is now completed and appears in showcase
    }

    /**
     * Test the new modules-materials-quizzes structure and quiz attempt scoring API.
     */
    public function test_materials_and_quiz_endpoints()
    {
        $studentToken = $this->getStudentToken();

        $course = Course::where('title', 'Pengantar Ekonomi Sirkular')->first();

        // 1. Get Course details and check nested structure
        $courseResponse = $this->getJson('/api/v1/courses/' . $course->id, [
            'Authorization' => 'Bearer ' . $studentToken
        ]);

        $courseResponse->assertStatus(200);
        
        // Assert Module 1 has materials and a quiz
        $modules = $courseResponse->json('modules');
        $this->assertNotEmpty($modules);
        $this->assertEquals('Pengenalan Ekonomi Sirkular pada Sektor F&B', $modules[0]['title']);
        $this->assertFalse($modules[0]['is_project_based']);
        $this->assertNotEmpty($modules[0]['materials']);
        $this->assertNotEmpty($modules[0]['quiz']);
        
        // Check hiding of correct_answer or is_correct in quiz questions JSON output
        $questions = $modules[0]['quiz']['questions'];
        $this->assertNotEmpty($questions);
        $this->assertArrayNotHasKey('correct_answer', $questions[0]); // Hidden security
        $this->assertNotEmpty($questions[0]['options']);
        $this->assertArrayNotHasKey('is_correct', $questions[0]['options'][0]); // Hidden security

        $quizId = $modules[0]['quiz']['id'];
        $q1 = $questions[0]['id'];
        $q2 = $questions[1]['id'];

        $options1 = $questions[0]['options'];
        $options2 = $questions[1]['options'];

        // Get option IDs by matching option text
        $opt1Id = collect($options1)->firstWhere('option_text', 'Meminimalkan limbah dan memaksimalkan penggunaan sumber daya')['id'];
        $opt1WrongId = collect($options1)->firstWhere('option_text', 'Meningkatkan volume produksi barang plastik sekali pakai')['id'];

        $opt2Id = collect($options2)->firstWhere('option_text', 'Plastik singkong (Cassava Bag)')['id'];
        $opt2WrongId = collect($options2)->firstWhere('option_text', 'Styrofoam tebal')['id'];

        // 2. Submit correct answers to Quiz
        $submitResponse = $this->postJson("/api/v1/quizzes/{$quizId}/submit", [
            'answers' => [
                $q1 => $opt1Id,
                $q2 => $opt2Id,
            ]
        ], [
            'Authorization' => 'Bearer ' . $studentToken
        ]);

        $submitResponse->assertStatus(200)
            ->assertJsonPath('score', 100)
            ->assertJsonPath('is_passed', true)
            ->assertJsonPath('correct_count', 2);

        // 3. Submit incorrect answers to Quiz
        $failResponse = $this->postJson("/api/v1/quizzes/{$quizId}/submit", [
            'answers' => [
                $q1 => $opt1WrongId,
                $q2 => $opt2WrongId,
            ]
        ], [
            'Authorization' => 'Bearer ' . $studentToken
        ]);

        $failResponse->assertStatus(200)
            ->assertJsonPath('score', 0)
            ->assertJsonPath('is_passed', false)
            ->assertJsonPath('correct_count', 0);

        // 4. Retrieve Quiz attempt logs
        $attemptsResponse = $this->getJson("/api/v1/quizzes/{$quizId}/attempts", [
            'Authorization' => 'Bearer ' . $studentToken
        ]);

        $attemptsResponse->assertStatus(200)
            ->assertJsonCount(2); // 2 from this test
    }

    /**
     * Test community forum interaction.
     */
    public function test_forum_interaction()
    {
        $studentToken = $this->getStudentToken();
        $instructorToken = $this->getInstructorToken();

        // 1. Student creates a discussion thread
        $threadResponse = $this->postJson('/api/v1/forum', [
            'title' => 'Diskusi tentang Biomassa Jagung',
            'body' => 'Apakah biomassa jagung efektif di daerah pedesaan?',
        ], [
            'Authorization' => 'Bearer ' . $studentToken
        ]);

        $threadResponse->assertStatus(201)
            ->assertJsonPath('title', 'Diskusi tentang Biomassa Jagung');

        $threadId = $threadResponse->json('id');

        // 2. Instructor comments on the thread
        $commentResponse = $this->postJson("/api/v1/forum/{$threadId}/comments", [
            'body' => 'Sangat efektif jika pasokan bonggol jagung melimpah dan diolah dengan gasifikasi.',
        ], [
            'Authorization' => 'Bearer ' . $instructorToken
        ]);

        $commentResponse->assertStatus(201)
            ->assertJsonPath('body', 'Sangat efektif jika pasokan bonggol jagung melimpah dan diolah dengan gasifikasi.');

        // 3. View thread comments
        $viewResponse = $this->getJson("/api/v1/forum/{$threadId}");
        $viewResponse->assertStatus(200)
            ->assertJsonCount(1, 'comments');
    }

    // Helper functions
    private function getStudentToken()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'student@ecocademy.com',
            'password' => 'password',
        ]);
        return $response->json('access_token');
    }

    private function getInstructorToken()
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'instructor@ecocademy.com',
            'password' => 'password',
        ]);
        return $response->json('access_token');
    }
}
