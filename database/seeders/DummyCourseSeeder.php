<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\Milestone;
use App\Models\Module;
use App\Models\PblDetail;
use App\Models\Quiz;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use App\Models\User;
use Illuminate\Database\Seeder;

class DummyCourseSeeder extends Seeder
{
    public function run(): void
    {
        $instructor = User::query()->where('email', 'instructor@ecocademy.com')->first();
        $categories = Category::all();

        if ($categories->isEmpty()) {
            return;
        }

        $thumbnails = [
            'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
            'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
            'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&q=80',
            'https://images.unsplash.com/photo-1470071131384-001b85755536?w=800&q=80',
            'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80',
            'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
            'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80',
        ];

        for ($i = 1; $i <= 10; $i++) {
            $cat = $categories->random();

            $course = Course::create([
                'title' => "Eksplorasi Keberlanjutan Seri $i: " . $cat->name,
                'description' => "Kursus interaktif yang membahas inovasi dan praktik terbaik di bidang {$cat->name} ramah lingkungan.",
                'category_id' => $cat->id,
                'instructor_id' => $instructor->id,
                'is_published' => true,
                'duration' => 0,
                'score' => rand(85, 99),
                'rating' => rand(40, 50) / 10,
                'image' => $thumbnails[$i - 1],
                'level' => ($i % 2 == 0) ? 'Menengah' : 'Dasar',
                'full_description' => "Selamat datang di kursus seri $i. Di sini Anda akan belajar menerapkan konsep {$cat->name} berkelanjutan untuk menyelesaikan masalah lingkungan lokal. Pendekatan berbasis proyek akan membantu Anda terjun langsung.",
            ]);

            // Create standard module with quiz
            $modTheory = Module::create([
                'course_id' => $course->id,
                'title' => "Teori Fundamental {$cat->name} Hijau",
                'description' => "Pengenalan konsep dan studi kasus untuk seri $i.",
                'sequence' => 1,
                'is_project_based' => false,
            ]);

            $quiz = Quiz::create([
                'module_id' => $modTheory->id,
                'title' => "Kuis Evaluasi Modul Teori Seri $i",
                'instructions' => 'Jawab pertanyaan berikut untuk menguji pemahaman teori Anda.',
            ]);

            $q1 = QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question_text' => 'Apa langkah pertama dalam menerapkan konsep berkelanjutan pada bidang ini?',
                'sequence' => 1,
            ]);
            QuizOption::create(['question_id' => $q1->id, 'option_text' => 'Mengabaikan dampak lingkungan', 'is_correct' => false]);
            QuizOption::create(['question_id' => $q1->id, 'option_text' => 'Menganalisis siklus hidup dan penggunaan sumber daya', 'is_correct' => true]);
            QuizOption::create(['question_id' => $q1->id, 'option_text' => 'Meningkatkan eksploitasi alam', 'is_correct' => false]);

            $q2 = QuizQuestion::create([
                'quiz_id' => $quiz->id,
                'question_text' => 'Manakah dari berikut ini yang BUKAN praktik ramah lingkungan?',
                'sequence' => 2,
            ]);
            QuizOption::create(['question_id' => $q2->id, 'option_text' => 'Penggunaan material sekali pakai', 'is_correct' => true]);
            QuizOption::create(['question_id' => $q2->id, 'option_text' => 'Daur ulang limbah', 'is_correct' => false]);
            QuizOption::create(['question_id' => $q2->id, 'option_text' => 'Efisiensi energi', 'is_correct' => false]);


            // Create PBL module
            $modProject = Module::create([
                'course_id' => $course->id,
                'title' => "Aksi Lapangan (PjBL) Seri $i",
                'description' => "Modul tugas akhir berbasis proyek untuk mengimplementasikan solusi nyata.",
                'sequence' => 2,
                'is_project_based' => true,
            ]);

            PblDetail::create([
                'course_id' => $course->id,
                'title' => "Proyek Akhir UMKM: $cat->name",
                'description' => "Proyek implementasi konsep $cat->name untuk mitra lokal.",
                'target_audience' => 'UMKM Lokal',
                'duration' => 21,
                'report_requirements' => 'Laporan akhir dikumpulkan dalam bentuk dokumen dan foto dokumentasi kegiatan.'
            ]);

            Milestone::create([
                'course_id' => $course->id,
                'title' => 'Formulasi Masalah',
                'instructions' => 'Identifikasi masalah lingkungan di UMKM terdekat dan buat laporannya.',
                'duration_hours' => 5,
                'report_type' => 'document',
                'sequence' => 1,
            ]);
            Milestone::create([
                'course_id' => $course->id,
                'title' => 'Perancangan Solusi',
                'instructions' => 'Rancang solusi inovatif yang dapat diterapkan UMKM.',
                'duration_hours' => 4,
                'report_type' => 'document',
                'sequence' => 2,
            ]);
            Milestone::create([
                'course_id' => $course->id,
                'title' => 'Implementasi',
                'instructions' => 'Terapkan solusi di lapangan dan dokumentasikan hasilnya.',
                'duration_hours' => 10,
                'report_type' => 'image',
                'sequence' => 3,
            ]);
            Milestone::create([
                'course_id' => $course->id,
                'title' => 'Evaluasi',
                'instructions' => 'Evaluasi dampak ekologis dari solusi yang telah diimplementasikan.',
                'duration_hours' => 2,
                'report_type' => 'document',
                'sequence' => 4,
            ]);

            $course->recalculateDuration();
        }
    }
}
