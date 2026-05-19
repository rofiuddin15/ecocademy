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
        // 1. Categories Table
        Schema::create('categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Courses Table
        Schema::create('courses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->uuid('category_id');
            $table->uuid('instructor_id');
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreign('instructor_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 3. Modules Table
        Schema::create('modules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('course_id');
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->integer('sequence');
            $table->boolean('is_project_based')->default(false);
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        // 4. Materials Table (Materi Pembelajaran)
        Schema::create('materials', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('module_id');
            $table->string('title', 150);
            $table->enum('content_type', ['video', 'article', 'pdf']);
            $table->string('content_url', 255)->nullable();
            $table->text('body_text')->nullable();
            $table->integer('sequence');
            $table->timestamps();

            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
        });

        // 5. Quizzes Table (Kuis Evaluasi)
        Schema::create('quizzes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('module_id');
            $table->string('title', 150);
            $table->text('instructions')->nullable();
            $table->timestamps();

            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
        });

        // 6. Quiz Questions Table (Pertanyaan Pilihan Ganda)
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('quiz_id');
            $table->text('question_text');
            $table->integer('sequence');
            $table->timestamps();

            $table->foreign('quiz_id')->references('id')->on('quizzes')->onDelete('cascade');
        });

        // 7. Quiz Options Table (Pilihan Jawaban Pertanyaan)
        Schema::create('quiz_options', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('question_id');
            $table->text('option_text');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();

            $table->foreign('question_id')->references('id')->on('quiz_questions')->onDelete('cascade');
        });

        // 8. Quiz Attempts Table (Hasil Pengerjaan Kuis)
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('quiz_id');
            $table->uuid('user_id');
            $table->decimal('score', 5, 2);
            $table->boolean('is_passed')->default(false);
            $table->timestamps();

            $table->foreign('quiz_id')->references('id')->on('quizzes')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 9. Quiz Attempt Answers Table (Detail Jawaban Mahasiswa)
        Schema::create('quiz_attempt_answers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('attempt_id');
            $table->uuid('question_id');
            $table->uuid('selected_option_id');
            $table->boolean('is_correct')->default(false);
            $table->timestamps();

            $table->foreign('attempt_id')->references('id')->on('quiz_attempts')->onDelete('cascade');
            $table->foreign('question_id')->references('id')->on('quiz_questions')->onDelete('cascade');
            $table->foreign('selected_option_id')->references('id')->on('quiz_options')->onDelete('cascade');
        });

        // 10. Milestones Table (Tahapan Proyek PjBL)
        Schema::create('milestones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('course_id');
            $table->string('title', 100);
            $table->text('instructions');
            $table->dateTime('due_date')->nullable();
            $table->integer('sequence');
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        // 11. Projects Table (Tim Proyek Mahasiswa)
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('course_id');
            $table->uuid('student_id');
            $table->string('title', 150);
            $table->string('umkm_name', 100);
            $table->string('umkm_sector', 50);
            $table->enum('status', ['planning', 'executing', 'completed'])->default('planning');
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 12. Submissions Table (Unggah Tugas Proyek)
        Schema::create('submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->uuid('milestone_id');
            $table->uuid('submitted_by');
            $table->string('file_url', 255)->nullable();
            $table->text('student_notes')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('milestone_id')->references('id')->on('milestones')->onDelete('cascade');
            $table->foreign('submitted_by')->references('id')->on('users')->onDelete('cascade');
        });

        // 13. Feedbacks Table (Evaluasi Instruktur)
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('submission_id');
            $table->uuid('evaluator_id');
            $table->decimal('grade', 5, 2);
            $table->integer('green_impact_score');
            $table->text('comments')->nullable();
            $table->timestamps();

            $table->foreign('submission_id')->references('id')->on('submissions')->onDelete('cascade');
            $table->foreign('evaluator_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 14. Forum Threads Table
        Schema::create('forum_threads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('title', 150);
            $table->text('body');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // 15. Forum Comments Table
        Schema::create('forum_comments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('thread_id');
            $table->uuid('user_id');
            $table->text('body');
            $table->timestamps();

            $table->foreign('thread_id')->references('id')->on('forum_threads')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forum_comments');
        Schema::dropIfExists('forum_threads');
        Schema::dropIfExists('feedbacks');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('milestones');
        Schema::dropIfExists('quiz_attempt_answers');
        Schema::dropIfExists('quiz_attempts');
        Schema::dropIfExists('quiz_options');
        Schema::dropIfExists('quiz_questions');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('materials');
        Schema::dropIfExists('modules');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('categories');
    }
};
