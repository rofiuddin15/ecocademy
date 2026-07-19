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
        // For SQLite, modifying columns is limited. We need to be careful.
        // We can add columns safely. To change `module_id` to nullable in SQLite, it's safer to just add the new columns and handle `module_id` being empty at the application layer or by disabling foreign key constraints during alter. But let's use the standard `change()`.
        
        Schema::table('quizzes', function (Blueprint $table) {
            $table->enum('type', ['quiz', 'pretest', 'posttest'])->default('quiz')->after('id');
            $table->uuid('course_id')->nullable()->after('type');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->uuid('module_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quizzes', function (Blueprint $table) {
            $table->dropForeign(['course_id']);
            $table->dropColumn('course_id');
            $table->dropColumn('type');
            $table->uuid('module_id')->nullable(false)->change();
        });
    }
};
