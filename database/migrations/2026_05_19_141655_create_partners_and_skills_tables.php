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
        // 1. Create partners table
        Schema::create('partners', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->string('logo_url', 255)->nullable();
            $table->timestamps();
        });

        // 2. Create course_partner pivot table
        Schema::create('course_partner', function (Blueprint $table) {
            $table->foreignUuid('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignUuid('partner_id')->constrained('partners')->onDelete('cascade');
            $table->primary(['course_id', 'partner_id']);
        });

        // 3. Create course_skills table (one-to-many)
        Schema::create('course_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('name', 150);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_skills');
        Schema::dropIfExists('course_partner');
        Schema::dropIfExists('partners');
    }
};
