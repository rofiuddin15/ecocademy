<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CourseManagementTest extends TestCase
{
    use RefreshDatabase;

    protected $instructor;
    protected $category;
    protected $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles
        \Spatie\Permission\Models\Role::create(['name' => 'instructor', 'guard_name' => 'api']);
        \Spatie\Permission\Models\Role::create(['name' => 'admin', 'guard_name' => 'api']);
        \Spatie\Permission\Models\Role::create(['name' => 'student', 'guard_name' => 'api']);

        // Create instructor
        /** @var \App\Models\User $instructor */
        $instructor = User::factory()->create();
        $this->instructor = $instructor;
        $this->instructor->assignRole('instructor');
        
        /** @var \PHPOpenSourceSaver\JWTAuth\JWTGuard $guard */
        $guard = auth('api');
        $this->token = $guard->login($this->instructor);

        // Create category
        $this->category = Category::create([
            'name' => 'Test Category',
            'slug' => 'test-category',
        ]);
    }

    public function test_instructor_can_create_full_course_with_pbl_and_curriculum()
    {
        // 1. Create Course
        $courseResponse = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->postJson('/api/v1/courses', [
                'title' => 'Test Eco Course',
                'description' => 'A course about ecology',
                'category_id' => $this->category->id,
                'duration' => '4 Weeks',
                'level' => 'Beginner',
            ]);

        $courseResponse->assertStatus(201);
        $courseId = $courseResponse->json('id');
        $this->assertNotNull($courseId);

        // 2. Add PBL Configuration
        $pblResponse = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->postJson("/api/v1/courses/{$courseId}/pbl", [
                'title' => 'Eco App Project',
                'description' => 'Create a green tech app.',
                'target_audience' => 'Local Farmers',
                'duration' => '4 Weeks',
                'report_requirements' => 'PDF with 10 pages.',
            ]);

        $pblResponse->assertStatus(200);
        $this->assertEquals('Eco App Project', $pblResponse->json('title'));

        // 3. Add Module
        $moduleResponse = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->postJson('/api/v1/modules', [
                'course_id' => $courseId,
                'title' => 'Module 1: Intro',
                'sequence' => 1,
            ]);

        $moduleResponse->assertStatus(201);
        $moduleId = $moduleResponse->json('id');

        // 4. Add Material
        $materialResponse = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->postJson('/api/v1/materials', [
                'module_id' => $moduleId,
                'title' => 'What is Green Tech?',
                'content_type' => 'article',
                'body_text' => 'Green tech is awesome.',
                'sequence' => 1,
            ]);

        $materialResponse->assertStatus(201);

        // 5. Add Quiz
        $quizResponse = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->postJson("/api/v1/modules/{$moduleId}/quizzes", [
                'title' => 'Module 1 Quiz',
                'instructions' => 'Answer all questions.',
                'questions' => [
                    [
                        'question_text' => 'Is recycling good?',
                        'options' => [
                            ['option_text' => 'Yes', 'is_correct' => true],
                            ['option_text' => 'No', 'is_correct' => false],
                        ]
                    ]
                ]
            ]);

        $quizResponse->assertStatus(201);
        $this->assertCount(1, $quizResponse->json('quiz.questions'));

        // 6. Add Milestone
        $milestoneResponse = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->postJson('/api/v1/milestones', [
                'course_id' => $courseId,
                'title' => 'Phase 1: Research',
                'instructions' => 'Interview 3 farmers.',
                'sequence' => 1,
            ]);

        $milestoneResponse->assertStatus(201);

        // 7. Verify Data via Course Show Endpoint (Eager Loading Test)
        $fetchResponse = $this->withHeader('Authorization', 'Bearer ' . $this->token)
            ->getJson("/api/v1/courses/{$courseId}");

        $fetchResponse->assertStatus(200);
        $fetchedCourse = $fetchResponse->json();

        $this->assertEquals('Test Eco Course', $fetchedCourse['title']);
        $this->assertEquals('Eco App Project', $fetchedCourse['pbl_detail']['title']);
        $this->assertCount(1, $fetchedCourse['modules']);
        $this->assertCount(1, $fetchedCourse['modules'][0]['materials']);
        $this->assertNotNull($fetchedCourse['modules'][0]['quiz']);
        $this->assertCount(1, $fetchedCourse['milestones']);
    }
}
