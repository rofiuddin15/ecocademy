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
        Schema::table('courses', function (Blueprint $table) {
            $table->string('duration', 50)->nullable()->after('is_published');
            $table->integer('score')->default(0)->after('duration');
            $table->decimal('rating', 3, 2)->default(5.00)->after('score');
            $table->text('image')->nullable()->after('rating');
            $table->string('level', 100)->nullable()->after('image');
            $table->text('full_description')->nullable()->after('level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['duration', 'score', 'rating', 'image', 'level', 'full_description']);
        });
    }
};
