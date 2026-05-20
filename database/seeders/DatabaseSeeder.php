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
use App\Models\QuizOption;
use App\Models\QuizAttemptAnswer;
use App\Models\Project;
use App\Models\Submission;
use App\Models\Feedback;
use App\Models\ForumThread;
use App\Models\ForumComment;
use App\Models\Partner;
use App\Models\CourseSkill;
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
        $catBusiness = Category::create([
            'name' => 'Bisnis',
            'description' => 'Pembelajaran seputar strategi model bisnis sirkular, closed-loop supply chain, logistik hijau, dan manajemen rantai nilai berkelanjutan.',
        ]);

        $catDesign = Category::create([
            'name' => 'Desain',
            'description' => 'Konsep perancangan produk ramah lingkungan sejak awal siklus hidup produk, bahan baku ramah lingkungan, dan kemasan bebas plastik.',
        ]);

        $catMarketing = Category::create([
            'name' => 'Pemasaran',
            'description' => 'Taktik branding etis, strategi penolakan greenwashing, kampanye digital eco-friendly, dan edukasi konsumen sadar lingkungan.',
        ]);

        // 4. Seed Partners (Mitra UMKM)
        $p1 = Partner::create([
            'name' => 'Local Craft Co.',
            'description' => 'Mitra kriya lokal yang berfokus pada anyaman bambu dan produk rotan tradisional.',
        ]);
        $p2 = Partner::create([
            'name' => 'Riau Eco-Bamboo',
            'description' => 'Penyedia bambu lestari bersertifikasi lokal untuk kerajinan tangan dan struktur ramah lingkungan.',
        ]);
        $p3 = Partner::create([
            'name' => 'EcoPack Solutions',
            'description' => 'Produsen kemasan nabati biodegradable dari pati singkong dan limbah jagung.',
        ]);
        $p4 = Partner::create([
            'name' => 'Green Logistics',
            'description' => 'Jasa pengiriman lokal menggunakan armada motor listrik rendah karbon.',
        ]);
        $p5 = Partner::create([
            'name' => 'Sustainable Craft Co.',
            'description' => 'Komunitas pengrajin daur ulang kain perca dan limbah plastik kemasan.',
        ]);
        $p6 = Partner::create([
            'name' => 'EarthCare Agency',
            'description' => 'Konsultan audit hijau yang membantu standarisasi produk UMKM ramah lingkungan.',
        ]);

        // 5. Seed Course 1: Desain Produk Berkelanjutan
        $course1 = Course::create([
            'title' => 'Desain Produk Berkelanjutan',
            'description' => 'Pelajari analisis siklus hidup dan ilmu material yang dibutuhkan untuk membangun produk bebas limbah.',
            'category_id' => $catDesign->id,
            'instructor_id' => $instructor->id,
            'is_published' => true,
            'duration' => '8 Minggu',
            'score' => 98,
            'rating' => 4.90,
            'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAz7ZDR4JpkNHb99yiH6SKi5RP5cq5oNUoGyZylnI-0Rl-E1El3Jzx0r6hLwVRbckAxi1wJBWwCT_KVBpchn-LkVIGpBg2X6erZGNt-6qwoYP7JF6scVoIMcXmSqxaqrN2kKtDK0lts2nVx0JvdFmm-VJ_iabODw5xRsL-c_ySRAwDpUYQyrpenDFrmPOUnCvnDb6fHhap9XqY2ynhLXnZUrAUrYlD6K5rqsACx1NrcNszfJj5_H_KzYCvjrQDPOqHhes8yL5SyAeV',
            'level' => 'Kemitraan UMKM',
            'full_description' => 'Pelajari metode merancang produk dengan jejak karbon minimal. Kursus ini membimbing Anda dari pemahaman teori siklus hidup bahan hingga penciptaan prototipe produk nyata siap pasar bersama UMKM kriya lokal.',
        ]);
        $course1->partners()->attach([$p1->id, $p2->id]);

        CourseSkill::create(['course_id' => $course1->id, 'name' => 'Analisis Siklus Hidup (LCA)']);
        CourseSkill::create(['course_id' => $course1->id, 'name' => 'Ilmu Material']);
        CourseSkill::create(['course_id' => $course1->id, 'name' => 'Desain Sirkular']);
        CourseSkill::create(['course_id' => $course1->id, 'name' => 'Eco-modeling 3D']);

        Module::create([
            'course_id' => $course1->id,
            'title' => 'Pengantar Desain Hijau & Kerangka Kerja Eco-Design',
            'description' => 'Prinsip dasar eco-design dan siklus hidup produk berkelanjutan.',
            'sequence' => 1,
            'is_project_based' => false,
        ]);
        Module::create([
            'course_id' => $course1->id,
            'title' => 'Lifecycle Analysis (LCA) & Pemilihan Material Berkelanjutan',
            'description' => 'Menganalisis dampak karbon dari pemilihan material mentah.',
            'sequence' => 2,
            'is_project_based' => false,
        ]);
        Module::create([
            'course_id' => $course1->id,
            'title' => 'Prototyping Produk Ramah Lingkungan dengan Bambu & Plastik Daur Ulang',
            'description' => 'Praktik membuat prototipe fisik dari bahan-bahan terbarukan.',
            'sequence' => 3,
            'is_project_based' => false,
        ]);
        Module::create([
            'course_id' => $course1->id,
            'title' => 'Kolaborasi Proyek PjBL bersama Mitra Pengrajin Lokal (UMKM Craft)',
            'description' => 'Aksi nyata merancang produk minim emisi bersama mitra pengrajin lokal.',
            'sequence' => 4,
            'is_project_based' => true,
        ]);

        // Seed Course 2: Pengantar Ekonomi Sirkular (Original Course variable name)
        $course = Course::create([
            'title' => 'Pengantar Ekonomi Sirkular',
            'description' => 'Kuasai kerangka kerja sistem closed-loop dan manajemen rantai pasok berkelanjutan.',
            'category_id' => $catBusiness->id,
            'instructor_id' => $instructor->id,
            'is_published' => true,
            'duration' => '6 Minggu',
            'score' => 92,
            'rating' => 4.80,
            'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVGD11ABAueKi-5Z4ZSUaGGv3psLoXSaxc2NuMONFwKPWYHc9Jj9CIeMBTY1yq2Y9pCcqKQg7Vt2Hs7ZABlcts2EAtUY48ZDJy2eapctYlvxOq2Qm_6ZSq_c0hjMaXPIOY2f6gQfemGmnf6h0wSRZpesJHTFS8geGYTWtxlCj6lFRl-9fl5gmxNW6FHU2Qrgj-P7oFZI1a7Qxl_SxY6EmkjMI4xRzefFyOxiWbXHgafP8hONdgSAMB20mNmrz8SxBRyQPpNp13L4NA',
            'level' => 'Dasar',
            'full_description' => 'Pelajari bagaimana mendesain ulang rantai nilai bisnis untuk meminimalkan limbah, memaksimalkan efisiensi sumber daya secara berkelanjutan, dan mendesain rantai pasok ramah lingkungan.',
        ]);
        $course->partners()->attach([$p3->id, $p4->id]);

        CourseSkill::create(['course_id' => $course->id, 'name' => 'Sistem Closed-Loop']);
        CourseSkill::create(['course_id' => $course->id, 'name' => 'Pemetaan Rantai Nilai']);
        CourseSkill::create(['course_id' => $course->id, 'name' => 'Valuasi Limbah']);
        CourseSkill::create(['course_id' => $course->id, 'name' => 'Logistik Hijau']);

        // Seed Course 3: Strategi Pemasaran Hijau
        $course3 = Course::create([
            'title' => 'Strategi Pemasaran Hijau',
            'description' => 'Komunikasikan nilai produk tanpa greenwashing. Branding etis untuk konsumen modern.',
            'category_id' => $catMarketing->id,
            'instructor_id' => $instructor->id,
            'is_published' => true,
            'duration' => '5 Minggu',
            'score' => 95,
            'rating' => 5.00,
            'image' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtMOianU1NrmW9bC5uCpmXxxBAkBL6nFv0hcJcTevkd6d9MRZv3FNB6NXFwwMMxuZXvjj4garynx5k903MZoHk_HDKsQ2GCqb4DMW3SZQBwd78Cb03YKz03rq-84bsOTjXc9tCPc2KbxU67bKvij56c8n1mHN6L9u98JUmuedWe3YNSUtRBkAYKNzniUYlWAvMAOO3T-ep5RZ9gqERUS9NQK91j2_5qJHemlC7t7BlgeUNZXi1xz1trB3o7DvAxkNT3GcUGX9RT-NR',
            'level' => 'Lanjutan',
            'full_description' => 'Kuasai taktik pemasaran etis untuk mengomunikasikan nilai keberlanjutan produk Anda tanpa terjebak dalam praktik greenwashing yang merusak reputasi brand.',
        ]);
        $course3->partners()->attach([$p5->id, $p6->id]);

        CourseSkill::create(['course_id' => $course3->id, 'name' => 'Branding Etis']);
        CourseSkill::create(['course_id' => $course3->id, 'name' => 'Strategi Anti-Greenwashing']);
        CourseSkill::create(['course_id' => $course3->id, 'name' => 'Kampanye Eco-Digital']);
        CourseSkill::create(['course_id' => $course3->id, 'name' => 'Komunikasi Dampak']);

        Module::create([
            'course_id' => $course3->id,
            'title' => 'Perilaku Konsumen Sadar Lingkungan (Conscious Consumer)',
            'description' => 'Memahami psikologi dan preferensi beli konsumen hijau.',
            'sequence' => 1,
            'is_project_based' => false,
        ]);
        Module::create([
            'course_id' => $course3->id,
            'title' => 'Branding Etis & Komunikasi Tanpa Greenwashing',
            'description' => 'Cara mengomunikasikan dampak produk secara transparan tanpa klaim palsu.',
            'sequence' => 2,
            'is_project_based' => false,
        ]);
        Module::create([
            'course_id' => $course3->id,
            'title' => 'Kampanye Digital Hijau & Pengukuran Dampak Pemasaran',
            'description' => 'Merancang kampanye digital untuk menjangkau pangsa pasar ramah lingkungan.',
            'sequence' => 3,
            'is_project_based' => false,
        ]);
        Module::create([
            'course_id' => $course3->id,
            'title' => 'Penyusunan Rencana Kampanye Pemasaran Hijau untuk UMKM Mitra',
            'description' => 'Membantu menyusun rencana green marketing bagi UMKM binaan.',
            'sequence' => 4,
            'is_project_based' => true,
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
            'sequence' => 1,
        ]);

        $opt1_1_a = QuizOption::create([
            'question_id' => $q1_1->id,
            'option_text' => 'Meminimalkan limbah dan memaksimalkan penggunaan sumber daya',
            'is_correct' => true,
        ]);
        $opt1_1_b = QuizOption::create([
            'question_id' => $q1_1->id,
            'option_text' => 'Meningkatkan volume produksi barang plastik sekali pakai',
            'is_correct' => false,
        ]);
        $opt1_1_c = QuizOption::create([
            'question_id' => $q1_1->id,
            'option_text' => 'Membuang sampah sebanyak mungkin ke tempat pembuangan akhir',
            'is_correct' => false,
        ]);

        $q1_2 = QuizQuestion::create([
            'quiz_id' => $quiz1->id,
            'question_text' => 'Manakah bahan kemasan berikut yang paling ramah lingkungan?',
            'sequence' => 2,
        ]);

        $opt1_2_a = QuizOption::create([
            'question_id' => $q1_2->id,
            'option_text' => 'Styrofoam tebal',
            'is_correct' => false,
        ]);
        $opt1_2_b = QuizOption::create([
            'question_id' => $q1_2->id,
            'option_text' => 'Plastik singkong (Cassava Bag)',
            'is_correct' => true,
        ]);
        $opt1_2_c = QuizOption::create([
            'question_id' => $q1_2->id,
            'option_text' => 'Kantong plastik hitam biasa',
            'is_correct' => false,
        ]);

        // Seed a passed attempt for Student 1 on Quiz 1
        $attempt1 = QuizAttempt::create([
            'quiz_id' => $quiz1->id,
            'user_id' => $student->id,
            'score' => 100.00,
            'is_passed' => true,
        ]);

        // Seed attempt details/answers for Student 1
        QuizAttemptAnswer::create([
            'attempt_id' => $attempt1->id,
            'question_id' => $q1_1->id,
            'selected_option_id' => $opt1_1_a->id,
            'is_correct' => true,
        ]);

        QuizAttemptAnswer::create([
            'attempt_id' => $attempt1->id,
            'question_id' => $q1_2->id,
            'selected_option_id' => $opt1_2_b->id,
            'is_correct' => true,
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
            'sequence' => 1,
        ]);

        QuizOption::create([
            'question_id' => $q2_1->id,
            'option_text' => 'Membeli mesin komposter industri yang mahal',
            'is_correct' => false,
        ]);
        QuizOption::create([
            'question_id' => $q2_1->id,
            'option_text' => 'Mengukur berat dan mengelompokkan jenis sampah harian',
            'is_correct' => true,
        ]);
        QuizOption::create([
            'question_id' => $q2_1->id,
            'option_text' => 'Langsung membuang semua sampah ke pekarangan belakang',
            'is_correct' => false,
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
