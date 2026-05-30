<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseSkill;
use App\Models\Material;
use App\Models\Milestone;
use App\Models\Module;
use App\Models\Partner;
use App\Models\PblDetail;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $instructor = User::query()->where('email', 'instructor@ecocademy.com')->first();
        
        $catBusiness = Category::query()->where('name', 'Bisnis')->first();
        $catDesign = Category::query()->where('name', 'Desain')->first();
        $catMarketing = Category::query()->where('name', 'Pemasaran')->first();

        $p1 = Partner::query()->where('name', 'Local Craft Co.')->first();
        $p2 = Partner::query()->where('name', 'Riau Eco-Bamboo')->first();
        $p3 = Partner::query()->where('name', 'EcoPack Solutions')->first();
        $p4 = Partner::query()->where('name', 'Green Logistics')->first();
        $p5 = Partner::query()->where('name', 'Sustainable Craft Co.')->first();
        $p6 = Partner::query()->where('name', 'EarthCare Agency')->first();

        // 1. Course 1: Desain Produk Berkelanjutan
        $course1 = Course::create([
            'title' => 'Desain Produk Berkelanjutan',
            'description' => 'Pelajari analisis siklus hidup dan ilmu material yang dibutuhkan untuk membangun produk bebas limbah.',
            'category_id' => $catDesign->id,
            'instructor_id' => $instructor->id,
            'is_published' => true,
            'duration' => 0,
            'score' => 98,
            'rating' => 4.90,
            'image' => 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800&q=80',
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

        // 2. Course 2: Pengantar Ekonomi Sirkular
        $course2 = Course::create([
            'title' => 'Pengantar Ekonomi Sirkular',
            'description' => 'Kuasai kerangka kerja sistem closed-loop dan manajemen rantai pasok berkelanjutan.',
            'category_id' => $catBusiness->id,
            'instructor_id' => $instructor->id,
            'is_published' => true,
            'duration' => 0,
            'score' => 92,
            'rating' => 4.80,
            'image' => 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80',
            'level' => 'Dasar',
            'full_description' => 'Pelajari bagaimana mendesain ulang rantai nilai bisnis untuk meminimalkan limbah, memaksimalkan efisiensi sumber daya secara berkelanjutan, dan mendesain rantai pasok ramah lingkungan.',
        ]);
        $course2->partners()->attach([$p3->id, $p4->id]);

        CourseSkill::create(['course_id' => $course2->id, 'name' => 'Sistem Closed-Loop']);
        CourseSkill::create(['course_id' => $course2->id, 'name' => 'Pemetaan Rantai Nilai']);
        CourseSkill::create(['course_id' => $course2->id, 'name' => 'Valuasi Limbah']);
        CourseSkill::create(['course_id' => $course2->id, 'name' => 'Logistik Hijau']);

        $mod1 = Module::create([
            'course_id' => $course2->id,
            'title' => 'Pengenalan Ekonomi Sirkular pada Sektor F&B',
            'description' => 'Memahami landasan konsep sirkular ekonomi dan perbedaannya dengan ekonomi linear dalam industri kuliner.',
            'sequence' => 1,
            'is_project_based' => false,
        ]);

        Material::create([
            'module_id' => $mod1->id,
            'title' => 'Konsep Utama Ekonomi Sirkular di Bisnis Kuliner',
            'content_type' => 'article',
            'body_text' => 'Ekonomi sirkular adalah model ekonomi yang bertujuan meminimalkan limbah dan memaksimalkan penggunaan sumber daya. Di sektor makanan dan minuman (F&B), konsep ini diimplementasikan dengan mengurangi sisa makanan (food waste), memanfaatkan limbah dapur menjadi produk bernilai (seperti eco-enzyme), serta merancang kemasan ramah lingkungan.',
            'sequence' => 1,
            'duration_minutes' => 45,
        ]);

        Material::create([
            'module_id' => $mod1->id,
            'title' => 'Video Studi Kasus: Upcycling Limbah Sayuran Warung Makan',
            'content_type' => 'video',
            'content_url' => 'https://www.youtube.com/watch?v=example-eco',
            'body_text' => 'Tonton video studi kasus bagaimana sebuah restoran lokal berhasil memotong biaya pembuangan sampah hingga 40% dengan mengolah sisa sayuran segar menjadi bumbu kaldu bubuk alami.',
            'sequence' => 2,
            'duration_minutes' => 15,
        ]);

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
        QuizOption::create(['question_id' => $q1_1->id, 'option_text' => 'Meminimalkan limbah dan memaksimalkan penggunaan sumber daya', 'is_correct' => true]);
        QuizOption::create(['question_id' => $q1_1->id, 'option_text' => 'Meningkatkan volume produksi barang plastik sekali pakai', 'is_correct' => false]);
        QuizOption::create(['question_id' => $q1_1->id, 'option_text' => 'Membuang sampah sebanyak mungkin ke tempat pembuangan akhir', 'is_correct' => false]);

        $q1_2 = QuizQuestion::create([
            'quiz_id' => $quiz1->id,
            'question_text' => 'Manakah bahan kemasan berikut yang paling ramah lingkungan?',
            'sequence' => 2,
        ]);
        QuizOption::create(['question_id' => $q1_2->id, 'option_text' => 'Styrofoam tebal', 'is_correct' => false]);
        QuizOption::create(['question_id' => $q1_2->id, 'option_text' => 'Plastik singkong (Cassava Bag)', 'is_correct' => true]);
        QuizOption::create(['question_id' => $q1_2->id, 'option_text' => 'Kantong plastik hitam biasa', 'is_correct' => false]);

        $mod2 = Module::create([
            'course_id' => $course2->id,
            'title' => 'Manajemen dan Audit Limbah Sederhana',
            'description' => 'Mempelajari cara menghitung timbulan sampah dan melacak titik pemborosan energi di tempat usaha kuliner.',
            'sequence' => 2,
            'is_project_based' => false,
        ]);

        Material::create([
            'module_id' => $mod2->id,
            'title' => 'Checklist Audit Energi & Limbah UMKM',
            'content_type' => 'pdf',
            'content_url' => '/storage/materials/panduan_audit_umkm.pdf',
            'body_text' => 'Unduh panduan PDF berikut yang berisi checklist lengkap untuk mendata pembuangan energi, air, kemasan plastik, dan sisa bahan makanan di UMKM kuliner.',
            'sequence' => 1,
            'duration_minutes' => 60,
        ]);

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
        QuizOption::create(['question_id' => $q2_1->id, 'option_text' => 'Membeli mesin komposter industri yang mahal', 'is_correct' => false]);
        QuizOption::create(['question_id' => $q2_1->id, 'option_text' => 'Mengukur berat dan mengelompokkan jenis sampah harian', 'is_correct' => true]);
        QuizOption::create(['question_id' => $q2_1->id, 'option_text' => 'Langsung membuang semua sampah ke pekarangan belakang', 'is_correct' => false]);

        $mod3 = Module::create([
            'course_id' => $course2->id,
            'title' => 'Tugas Akhir: Proyek Hijau Berbasis PjBL (Aksi Lapangan)',
            'description' => 'Modul berbasis proyek (PjBL) di mana mahasiswa secara berkelompok turun ke lapangan untuk membantu merancang aksi nyata dengan UMKM mitra.',
            'sequence' => 3,
            'is_project_based' => true,
        ]);

        PblDetail::create([
            'course_id' => $course2->id,
            'title' => 'Audit & Inovasi Lingkungan UMKM Kuliner',
            'description' => 'Membantu UMKM kuliner mitra untuk mengurangi limbah dan mengoptimalkan penggunaan energi.',
            'target_audience' => 'UMKM Kuliner (Warung Makan, Kafe, Restoran Lokal)',
            'duration' => 22, // 5 + 3 + 10 + 4
            'report_requirements' => 'Laporan harus diunggah dalam format PDF. Bukti foto wajib dilampirkan pada tahap eksekusi.'
        ]);

        Milestone::create([
            'course_id' => $course2->id,
            'title' => 'Formulasi Masalah: Audit Dampak Lingkungan UMKM',
            'instructions' => 'Kunjungi UMKM kuliner mitra Anda. Lakukan observasi dan wawancara terhadap penggunaan air, energi, kemasan sekali pakai, serta rata-rata berat limbah yang dihasilkan setiap hari. Unggah berkas laporan audit dalam format PDF.',
            'duration_hours' => 5,
            'report_type' => 'document',
            'sequence' => 1,
        ]);
        Milestone::create([
            'course_id' => $course2->id,
            'title' => 'Perencanaan Proyek: Desain Inovasi Hijau',
            'instructions' => 'Rancang solusi daur ulang atau efisiensi hijau yang terjangkau bagi UMKM tersebut (contoh: pembuatan instalasi komposter sederhana, atau perubahan kemasan ke plastik singkong). Unggah dokumen proposal rencana proyek beserta estimasi biaya.',
            'duration_hours' => 3,
            'report_type' => 'document',
            'sequence' => 2,
        ]);
        Milestone::create([
            'course_id' => $course2->id,
            'title' => 'Eksekusi & Monitoring Aksi Lapangan',
            'instructions' => 'Implementasikan alat atau sistem yang telah direncanakan bersama pemilik UMKM. Ambil foto/video saat pengerjaan dan catat dampak awal (misal: volume sampah berkurang). Unggah laporan progres implementasi beserta foto aksi.',
            'duration_hours' => 10,
            'report_type' => 'image',
            'sequence' => 3,
        ]);
        Milestone::create([
            'course_id' => $course2->id,
            'title' => 'Evaluasi Dampak Hijau & Refleksi Akhir',
            'instructions' => 'Lakukan analisis dampak ekonomi (penghematan uang) dan dampak ekologi (pengurangan sampah/karbon). Unggah laporan akhir lengkap dan tuliskan refleksi pembelajaran individu mengenai hambatan sosial-ekonomi yang dialami selama proyek.',
            'duration_hours' => 4,
            'report_type' => 'document',
            'sequence' => 4,
        ]);

        // 3. Course 3: Strategi Pemasaran Hijau
        $course3 = Course::create([
            'title' => 'Strategi Pemasaran Hijau',
            'description' => 'Komunikasikan nilai produk tanpa greenwashing. Branding etis untuk konsumen modern.',
            'category_id' => $catMarketing->id,
            'instructor_id' => $instructor->id,
            'is_published' => true,
            'duration' => 0,
            'score' => 95,
            'rating' => 5.00,
            'image' => 'https://images.unsplash.com/photo-1498837167922-41c543bd8e05?w=800&q=80',
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

        $course1->recalculateDuration();
        $course2->recalculateDuration();
        $course3->recalculateDuration();
    }
}
