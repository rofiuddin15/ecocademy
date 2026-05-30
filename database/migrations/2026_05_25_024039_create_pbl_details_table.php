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
        Schema::create('pbl_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('course_id')->unique();
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->text('target_audience')->nullable();
            $table->integer('duration')->default(0);
            $table->text('report_requirements')->nullable();
            $table->timestamps();

            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pbl_details');
    }
};
