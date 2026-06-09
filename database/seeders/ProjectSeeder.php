<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Feedback;
use App\Models\Project;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::query()->where('email', 'student@ecocademy.com')->first();
        $instructor = User::query()->where('email', 'instructor@ecocademy.com')->first();
        $course = Course::query()->where('title', 'Pengantar Ekonomi Sirkular')->first();

        if (!$student || !$course || !$instructor) {
            return;
        }

        $milestones = $course->milestones;
        if ($milestones->count() < 2) {
            return;
        }

        $m1 = $milestones->where('sequence', 1)->first();
        $m2 = $milestones->where('sequence', 2)->first();

        // 1. Seed Project (Proyek Mahasiswa)
        $project = Project::create([
            'course_id' => $course->id,
            'student_id' => $student->id,
            'title' => 'Inovasi Biokomposter Anaerob untuk Limbah Sayur Warung Bu Tedjo',
            'umkm_name' => 'Warung Nasi Bu Tedjo',
            'umkm_sector' => 'F&B (Makanan & Minuman)',
            'status' => 'executing',
        ]);

        // 2. Seed Submissions (Pengiriman Tugas)
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

        // ====================================================
        // SEED PROJECT UNTUK KURSUS KEWIRAUSAHAAN PjBL
        // ====================================================
        $courseKwu = Course::query()->where('title', 'Kewirausahaan: Greenpreneurship Berbasis Potensi Lokal Jawa Timur')->first();
        $student2 = User::query()->where('email', 'student2@ecocademy.com')->first();

        if ($courseKwu && $student2) {
            $kwuMilestones = $courseKwu->milestones;
            $kwuM1 = $kwuMilestones->where('sequence', 1)->first();

            // Project 1: Pending (Menunggu Persetujuan Dosen)
            Project::create([
                'course_id' => $courseKwu->id,
                'student_id' => $student2->id,
                'title' => 'Pemanfaatan Limbah Kulit Apel Malang menjadi Vegan Leather',
                'umkm_name' => 'Kelompok Tani Apel Kota Batu',
                'umkm_sector' => 'Pertanian & Kriya',
                'budget' => 2500000.00,
                'proposal_description' => 'Kami mengusulkan pengolahan limbah kulit apel yang tidak terpakai dari industri sari apel di Batu menjadi produk kulit sintetis nabati (vegan leather) untuk bahan baku tas.',
                'status' => 'pending',
            ]);

            // Project 2: Rejected (Ditolak, butuh revisi)
            Project::create([
                'course_id' => $courseKwu->id,
                'student_id' => $student->id,
                'title' => 'Bisnis Sabun Mandi Ramah Lingkungan',
                'umkm_name' => 'UMKM Sabun Lokal',
                'umkm_sector' => 'Kesehatan',
                'budget' => 1000000.00,
                'proposal_description' => 'Membuat sabun mandi organik tanpa bahan kimia sintetis yang aman untuk sungai.',
                'status' => 'rejected',
                'rejection_comment' => 'Ide sudah terlalu umum dan kurang mengeksplorasi potensi lokal spesifik Jawa Timur. Coba gali komoditas khas daerah, misalnya limbah pesisir laut atau pertanian spesifik. Silakan ajukan ulang proposalnya.',
            ]);

            // Project 3: Executing (Sudah disetujui & mengerjakan Tahap 1)
            $projectKwu3 = Project::create([
                'course_id' => $courseKwu->id,
                'student_id' => $student->id,
                'title' => 'Paving Block Berpori dari Limbah Cangkang Kerang Situbondo',
                'umkm_name' => 'Koperasi Nelayan Situbondo',
                'umkm_sector' => 'Material Bangunan Hijau',
                'budget' => 4500000.00,
                'proposal_description' => 'Mengurangi limbah cangkang kerang di pesisir Situbondo dengan mengolahnya menjadi material campuran paving block berpori yang dapat menyerap air hujan untuk mengurangi banjir rob.',
                'status' => 'executing',
            ]);

            if ($kwuM1) {
                $subKwu1 = Submission::create([
                    'project_id' => $projectKwu3->id,
                    'milestone_id' => $kwuM1->id,
                    'submitted_by' => $student->id,
                    'file_url' => '/storage/submissions/identifikasi_cangkang_kerang.pdf',
                    'student_notes' => 'Berikut adalah dokumen Essential Question Project kami. Masalah utamanya adalah penumpukan cangkang kerang yang menyebabkan pencemaran bau dan estetika di pantai.',
                    'submitted_at' => now()->subDays(1),
                ]);

                Feedback::create([
                    'submission_id' => $subKwu1->id,
                    'evaluator_id' => $instructor->id,
                    'grade' => 88.00,
                    'green_impact_score' => 4,
                    'comments' => 'Identifikasi masalah yang sangat bagus dan sangat spesifik dengan lokasi Jatim. Pertanyaan esensial sudah mengarah ke solusi sirkular. Silakan lanjut ke Tahap 2 Perencanaan Proyek.',
                ]);
            }
        }
    }
}
