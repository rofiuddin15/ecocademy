<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::create([
            'name' => 'Bisnis',
            'description' => 'Pembelajaran seputar strategi model bisnis sirkular, closed-loop supply chain, logistik hijau, dan manajemen rantai nilai berkelanjutan.',
        ]);

        Category::create([
            'name' => 'Desain',
            'description' => 'Konsep perancangan produk ramah lingkungan sejak awal siklus hidup produk, bahan baku ramah lingkungan, dan kemasan bebas plastik.',
        ]);

        Category::create([
            'name' => 'Pemasaran',
            'description' => 'Taktik branding etis, strategi penolakan greenwashing, kampanye digital eco-friendly, dan edukasi konsumen sadar lingkungan.',
        ]);
    }
}
