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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('action', 100); // login, logout, view_course, view_material, submit_quiz, enroll_course, complete_course, submit_project, view_forum, etc.
            $table->string('subject_type', 100)->nullable(); // 'Course', 'Module', 'Material', 'Quiz', 'Project', null
            $table->uuid('subject_id')->nullable();          // ID of the subject
            $table->string('subject_name', 255)->nullable(); // Human-readable name of the subject
            $table->json('metadata')->nullable();            // Extra context (score, etc.)
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index(['user_id', 'created_at']);
            $table->index(['subject_type', 'subject_id']);
            $table->index('action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
