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
        Schema::table('projects', function (Blueprint $table) {
            $table->decimal('budget', 15, 2)->nullable()->after('title');
            $table->text('proposal_description')->nullable()->after('budget');
            $table->foreignUuid('target_partner_id')->nullable()->constrained('partners')->nullOnDelete()->after('proposal_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['target_partner_id']);
            $table->dropColumn(['budget', 'proposal_description', 'target_partner_id']);
        });
    }
};
