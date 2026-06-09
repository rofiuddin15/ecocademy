<?php

namespace Database\Seeders;

use App\Models\Partner;
use Illuminate\Database\Seeder;

class PartnerSeeder extends Seeder
{
    public function run(): void
    {
        Partner::create([
            'name' => 'Local Craft Co.',
            'description' => 'Mitra kriya lokal yang berfokus pada anyaman bambu dan produk rotan tradisional.',
            'sector' => 'Kriya',
            'location' => 'Gianyar, Bali',
            'logo_url' => 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&q=80&w=800',
        ]);

        Partner::create([
            'name' => 'Riau Eco-Bamboo',
            'description' => 'Penyedia bambu lestari bersertifikasi lokal untuk kerajinan tangan dan struktur ramah lingkungan.',
            'sector' => 'Bahan Alam',
            'location' => 'Pekanbaru, Riau',
            'logo_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        ]);

        Partner::create([
            'name' => 'EcoPack Solutions',
            'description' => 'Produsen kemasan nabati biodegradable dari pati singkong dan limbah jagung.',
            'sector' => 'F&B',
            'location' => 'Surabaya, Jawa Timur',
            'logo_url' => 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=800',
        ]);

        Partner::create([
            'name' => 'Green Logistics',
            'description' => 'Jasa pengiriman lokal menggunakan armada motor listrik rendah karbon.',
            'sector' => 'Lainnya',
            'location' => 'Sidoarjo, Jawa Timur',
            'logo_url' => 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&q=80&w=800',
        ]);

        Partner::create([
            'name' => 'Sustainable Craft Co.',
            'description' => 'Komunitas pengrajin daur ulang kain perca dan limbah plastik kemasan.',
            'sector' => 'Kriya',
            'location' => 'Kota Batu, Jawa Timur',
            'logo_url' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
        ]);

        Partner::create([
            'name' => 'EarthCare Agency',
            'description' => 'Konsultan audit hijau yang membantu standarisasi produk UMKM ramah lingkungan.',
            'sector' => 'Lainnya',
            'location' => 'Gresik, Jawa Timur',
            'logo_url' => 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800',
        ]);

        // Partners matching seeded projects for consistency
        Partner::create([
            'name' => 'Warung Nasi Bu Tedjo',
            'description' => 'Warung makan legendaris dengan limbah sisa makanan yang cukup tinggi. Terbuka untuk inovasi biokomposter.',
            'sector' => 'F&B',
            'location' => 'Kota Batu, Jawa Timur',
            'logo_url' => 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
        ]);

        Partner::create([
            'name' => 'Kelompok Tani Apel Kota Batu',
            'description' => 'Kelompok tani sayur dan buah apel organik yang sedang menghadapi masalah efisiensi irigasi dan pupuk berkelanjutan.',
            'sector' => 'Agrikultur',
            'location' => 'Kota Batu, Jawa Timur',
            'logo_url' => 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=800',
        ]);

        Partner::create([
            'name' => 'Koperasi Nelayan Situbondo',
            'description' => 'Koperasi nelayan dengan hasil limbah cangkang kerang yang melimpah. Membutuhkan riset pengolahan limbah menjadi produk bernilai jual.',
            'sector' => 'Lainnya',
            'location' => 'Situbondo, Jawa Timur',
            'logo_url' => 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&q=80&w=800',
        ]);
    }
}
