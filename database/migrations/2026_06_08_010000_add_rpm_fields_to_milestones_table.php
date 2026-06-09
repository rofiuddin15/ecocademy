<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('milestones', function (Blueprint $table) {
            // Kolom-kolom RPM tambahan untuk mendukung detail tugas PjBL
            $table->text('student_activities')->nullable()->after('instructions');   // Aktivitas Mahasiswa
            $table->text('lms_deliverable')->nullable()->after('student_activities'); // Tagihan pada LMS
            $table->text('content_format')->nullable()->after('lms_deliverable');    // Format Isi Laporan
            $table->text('assessment_indicators')->nullable()->after('content_format'); // Indikator Penilaian
            $table->integer('weight')->default(0)->after('assessment_indicators');   // Bobot Nilai (%)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('milestones', function (Blueprint $table) {
            $table->dropColumn([
                'student_activities',
                'lms_deliverable',
                'content_format',
                'assessment_indicators',
                'weight',
            ]);
        });
    }
};
