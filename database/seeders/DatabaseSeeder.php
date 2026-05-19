<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Course;
use App\Models\Module;
use App\Models\Material;
use App\Models\Milestone;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizAttempt;
use App\Models\Project;
use App\Models\Submission;
use App\Models\Feedback;
use App\Models\ForumThread;
use App\Models\ForumComment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Spatie Roles for API guard
        $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'api']);
        $instructorRole = Role::create(['name' => 'instructor', 'guard_name' => 'api']);
        $studentRole = Role::create(['name' => 'student', 'guard_name' => 'api']);

        // 2. Seed Users
        $admin = User::create([
            'name' => 'Admin EcoVenture',
            'email' => 'admin@ecoventure.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'bio' => 'Administrator platform EcoVenture Academy. Bertanggung jawab atas kualitas konten dan kemitraan UMKM.',
        ]);
        $admin->assignRole('admin');

        $instructor = User::create([
            'name' => 'Dr. Rian Hermawan',
            'email' => 'instructor@ecoventure.com',
            'password' => Hash::make('password'),
            'role' => 'instructor',
            'bio' => 'Dosen Kewirausahaan Sosial & Konsultan Ekonomi Sirkular tingkat nasional dengan pengalaman 10+ tahun membimbing UMKM.',
        ]);
        $instructor->assignRole('instructor');

        $student = User::create([
            'name' => 'Budi Santoso',
            'email' => 'student@ecoventure.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'bio' => 'Mahasiswa tingkat akhir Teknik Lingkungan yang berfokus pada teknologi daur ulang sampah organik dan keberlanjutan lokal.',
        ]);
        $student->assignRole('student');

        $student2 = User::create([
            'name' => 'Siti Aminah',
            'email' => 'student2@ecoventure.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'bio' => 'Mahasiswa Bisnis Digital yang tertarik pada branding produk ramah lingkungan dan green marketing.',
        ]);
        $student2->assignRole('student');

        // 3. Seed Categories
        $catWaste = Category::create([
            'name' => 'Waste Management',
            'description' => 'Pembelajaran seputar pengolahan limbah padat, limbah cair, pemilahan sampah organik, serta pemanfaatan limbah menjadi produk bernilai ekonomi.',
        ]);

        $catDesign = Category::create([
            'name' => 'Eco-Design & Circular Product',
            'description' => 'Konsep perancangan produk yang ramah lingkungan sejak awal siklus hidup produk, bahan baku ramah lingkungan, dan kemasan bebas plastik.',
        ]);

        $catEnergy = Category::create([
            'name' => 'Renewable Energy & Energy Audit',
            'description' => 'Langkah-langkah efisiensi energi pada tempat usaha, audit energi sederhana, serta pemanfaatan teknologi energi baru terbarukan.',
        ]);

        // 4. Seed Course
        $course = Course::create([
            'title' => 'Greenpreneurship: Sirkular Ekonomi untuk UMKM Kuliner Lokal',
            'description' => 'Kursus praktis ini membimbing mahasiswa secara kolaboratif untuk membantu UMKM kuliner sekitar merancang rantai pasokan ramah lingkungan, melakukan efisiensi limbah dapur (food waste), dan membuat model bisnis sirkular.',
            'category_id' => $catWaste->id,
            'instructor_id' => $instructor->id,
            'is_published' => true,
        ]);

        // 5. Seed Module 1: Pengenalan Sirkular Ekonomi
        $mod1 = Module::create([
            'course_id' => $course->id,
            'title' => 'Pengenalan Ekonomi Sirkular pada Sektor F&B',
            'description' => 'Memahami landasan konsep sirkular ekonomi dan perbedaannya dengan ekonomi linear dalam industri kuliner.',
            'sequence' => 1,
            'is_project_based' => false,
        ]);

        // Materials for Module 1
        Material::create([
            'module_id' => $mod1->id,
            'title' => 'Konsep Utama Ekonomi Sirkular di Bisnis Kuliner',
            'content_type' => 'article',
            'body_text' => 'Ekonomi sirkular adalah model ekonomi yang bertujuan meminimalkan limbah dan memaksimalkan penggunaan sumber daya. Di sektor makanan dan minuman (F&B), konsep ini diimplementasikan dengan mengurangi sisa makanan (food waste), memanfaatkan limbah dapur menjadi produk bernilai (seperti eco-enzyme), serta merancang kemasan ramah lingkungan.',
            'sequence' => 1,
        ]);

        Material::create([
            'module_id' => $mod1->id,
            'title' => 'Video Studi Kasus: Upcycling Limbah Sayuran Warung Makan',
            'content_type' => 'video',
            'content_url' => 'https://www.youtube.com/watch?v=example-eco',
            'body_text' => 'Tonton video studi kasus bagaimana sebuah restoran lokal berhasil memotong biaya pembuangan sampah hingga 40% dengan mengolah sisa sayuran segar menjadi bumbu kaldu bubuk alami.',
            'sequence' => 2,
        ]);

        // Quiz for Module 1
        $quiz1 = Quiz::create([
            'module_id' => $mod1->id,
            'title' => 'Evaluasi Dasar Ekonomi Sirkular',
            'instructions' => 'Selesaikan pertanyaan pilihan ganda berikut untuk menguji pemahaman Anda mengenai prinsip-prinsip ekonomi sirkular.',
        ]);

        $q1_1 = QuizQuestion::create([
            'quiz_id' => $quiz1->id,
            'question_text' => 'Apa tujuan utama dari ekonomi sirkular?',
            'options' => [
                'Meminimalkan limbah dan memaksimalkan penggunaan sumber daya',
                'Meningkatkan volume produksi barang plastik sekali pakai',
                'Membuang sampah sebanyak mungkin ke tempat pembuangan akhir'
            ],
            'correct_answer' => 'Meminimalkan limbah dan memaksimalkan penggunaan sumber daya',
            'sequence' => 1,
        ]);

        $q1_2 = QuizQuestion::create([
            'quiz_id' => $quiz1->id,
            'question_text' => 'Manakah bahan kemasan berikut yang paling ramah lingkungan?',
            'options' => [
                'Styrofoam tebal',
                'Plastik singkong (Cassava Bag)',
                'Kantong plastik hitam biasa'
            ],
            'correct_answer' => 'Plastik singkong (Cassava Bag)',
            'sequence' => 2,
        ]);

        // Seed a passed attempt for Student 1 on Quiz 1
        QuizAttempt::create([
            'quiz_id' => $quiz1->id,
            'user_id' => $student->id,
            'score' => 100.00,
            'is_passed' => true,
        ]);

        // 6. Seed Module 2: Audit dan Manajemen Limbah
        $mod2 = Module::create([
            'course_id' => $course->id,
            'title' => 'Manajemen dan Audit Limbah Sederhana',
            'description' => 'Mempelajari cara menghitung timbulan sampah dan melacak titik pemborosan energi di tempat usaha kuliner.',
            'sequence' => 2,
            'is_project_based' => false,
        ]);

        // Materials for Module 2
        Material::create([
            'module_id' => $mod2->id,
            'title' => 'Checklist Audit Energi & Limbah UMKM',
            'content_type' => 'pdf',
            'content_url' => '/storage/materials/panduan_audit_umkm.pdf',
            'body_text' => 'Unduh panduan PDF berikut yang berisi checklist lengkap untuk mendata pembuangan energi, air, kemasan plastik, dan sisa bahan makanan di UMKM kuliner.',
            'sequence' => 1,
        ]);

        // Quiz for Module 2
        $quiz2 = Quiz::create([
            'module_id' => $mod2->id,
            'title' => 'Evaluasi Audit Lingkungan',
            'instructions' => 'Selesaikan evaluasi berikut sebelum memulai tugas akhir lapangan Anda.',
        ]);

        $q2_1 = QuizQuestion::create([
            'quiz_id' => $quiz2->id,
            'question_text' => 'Langkah pertama yang paling tepat sebelum merancang sistem komposter untuk UMKM kuliner adalah...',
            'options' => [
                'Membeli mesin komposter industri yang mahal',
                'Mengukur berat dan mengelompokkan jenis sampah harian',
                'Langsung membuang semua sampah ke pekarangan belakang'
            ],
            'correct_answer' => 'Mengukur berat dan mengelompokkan jenis sampah harian',
            'sequence' => 1,
        ]);

        // 7. Seed Module 3: Project-Based Learning Module (Final Module)
        $mod3 = Module::create([
            'course_id' => $course->id,
            'title' => 'Tugas Akhir: Proyek Hijau Berbasis PjBL (Aksi Lapangan)',
            'description' => 'Modul berbasis proyek (PjBL) di mana mahasiswa secara berkelompok turun ke lapangan untuk membantu merancang aksi nyata dengan UMKM mitra.',
            'sequence' => 3,
            'is_project_based' => true,
        ]);

        // 8. Seed Milestones (Tahapan Proyek PjBL)
        $m1 = Milestone::create([
            'course_id' => $course->id,
            'title' => 'Formulasi Masalah: Audit Dampak Lingkungan UMKM',
            'instructions' => 'Kunjungi UMKM kuliner mitra Anda. Lakukan observasi dan wawancara terhadap penggunaan air, energi, kemasan sekali pakai, serta rata-rata berat limbah yang dihasilkan setiap hari. Unggah berkas laporan audit dalam format PDF.',
            'due_date' => now()->addDays(7),
            'sequence' => 1,
        ]);

        $m2 = Milestone::create([
            'course_id' => $course->id,
            'title' => 'Perencanaan Proyek: Desain Inovasi Hijau',
            'instructions' => 'Rancang solusi daur ulang atau efisiensi hijau yang terjangkau bagi UMKM tersebut (contoh: pembuatan instalasi komposter sederhana, atau perubahan kemasan ke plastik singkong). Unggah dokumen proposal rencana proyek beserta estimasi biaya.',
            'due_date' => now()->addDays(14),
            'sequence' => 2,
        ]);

        $m3 = Milestone::create([
            'course_id' => $course->id,
            'title' => 'Eksekusi & Monitoring Aksi Lapangan',
            'instructions' => 'Implementasikan alat atau sistem yang telah direncanakan bersama pemilik UMKM. Ambil foto/video saat pengerjaan dan catat dampak awal (misal: volume sampah berkurang). Unggah laporan progres implementasi beserta foto aksi.',
            'due_date' => now()->addDays(21),
            'sequence' => 3,
        ]);

        $m4 = Milestone::create([
            'course_id' => $course->id,
            'title' => 'Evaluasi Dampak Hijau & Refleksi Akhir',
            'instructions' => 'Lakukan analisis dampak ekonomi (penghematan uang) dan dampak ekologi (pengurangan sampah/karbon). Unggah laporan akhir lengkap dan tuliskan refleksi pembelajaran individu mengenai hambatan sosial-ekonomi yang dialami selama proyek.',
            'due_date' => now()->addDays(28),
            'sequence' => 4,
        ]);

        // 9. Seed Project (Proyek Mahasiswa)
        $project = Project::create([
            'course_id' => $course->id,
            'student_id' => $student->id,
            'title' => 'Inovasi Biokomposter Anaerob untuk Limbah Sayur Warung Bu Tedjo',
            'umkm_name' => 'Warung Nasi Bu Tedjo',
            'umkm_sector' => 'F&B (Makanan & Minuman)',
            'status' => 'executing',
        ]);

        // 10. Seed Submissions (Pengiriman Tugas)
        $sub1 = Submission::create([
            'project_id' => $project->id,
            'milestone_id' => $m1->id,
            'submitted_by' => $student->id,
            'file_url' => '/storage/submissions/audit_lingkungan_bu_tedjo.pdf',
            'student_notes' => 'Berikut laporan hasil audit lingkungan di Warung Bu Tedjo. Kami menemukan rata-rata 12 kg limbah organik sayuran per hari dibuang langsung ke TPA tanpa pemilahan.',
            'submitted_at' => now()->subDays(5),
        ]);

        // Seed Feedback untuk Submission 1
        Feedback::create([
            'submission_id' => $sub1->id,
            'evaluator_id' => $instructor->id,
            'grade' => 87.50,
            'green_impact_score' => 4,
            'comments' => 'Audit yang sangat baik, Budi! Data kuantitatif limbah per hari disajikan dengan baik. Silakan lanjutkan ke perancangan alat pengomposan anaerob pada milestone berikutnya.',
        ]);

        $sub2 = Submission::create([
            'project_id' => $project->id,
            'milestone_id' => $m2->id,
            'submitted_by' => $student->id,
            'file_url' => '/storage/submissions/proposal_komposter_bu_tedjo.pdf',
            'student_notes' => 'Kami mendesain tong komposter anaerob mini berkapasitas 20kg menggunakan ember bekas cat dengan biaya di bawah Rp 100.000. Komposter ini akan menghasilkan pupuk cair organik untuk disalurkan ke petani lokal.',
            'submitted_at' => now()->subDays(2),
        ]);

        // Seed Feedback untuk Submission 2
        Feedback::create([
            'submission_id' => $sub2->id,
            'evaluator_id' => $instructor->id,
            'grade' => 93.00,
            'green_impact_score' => 5,
            'comments' => 'Luar biasa! Konsep ember bekas cat sangat ramah anggaran dan replikatif untuk UMKM kuliner kecil. Penggunaan bioaktivator EM4 direkomendasikan agar pengomposan lebih cepat. Nilai maksimal untuk dampak hijau.',
        ]);

        // 11. Seed Forum Threads & Comments
        $thread1 = ForumThread::create([
            'user_id' => $student->id,
            'title' => 'Cara mengatasi bau menyengat pada komposter anaerob di dapur UMKM?',
            'body' => 'Halo semuanya, saat ini saya sedang membantu warung makan mitra untuk memasang komposter anaerob di area belakang dapur mereka. Namun, mereka khawatir dengan bau sampah sayur yang menyengat. Apakah ada kiat khusus untuk meminimalkan bau selama proses dekomposisi berlangsung?',
        ]);

        ForumComment::create([
            'thread_id' => $thread1->id,
            'user_id' => $instructor->id,
            'body' => 'Halo Budi, pastikan tong komposter benar-benar kedap udara (seal karet rapat). Selain itu, taburkan abu kayu kering atau sekam padi di lapisan atas setiap kali limbah basah dimasukkan, hal ini dapat mengikat amonia gas pemicu bau.',
        ]);

        ForumComment::create([
            'thread_id' => $thread1->id,
            'user_id' => $student2->id,
            'body' => 'Saya juga menggunakan bioaktivator seperti Molase tape/EM4, Kak Budi! Selain mempercepat pembusukan, cairan ini menghasilkan aroma fermentasi asam manis seperti tape ketimbang bau busuk sampah.',
        ]);
    }
}
