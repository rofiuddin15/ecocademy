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
        ]);
        Partner::create([
            'name' => 'Riau Eco-Bamboo',
            'description' => 'Penyedia bambu lestari bersertifikasi lokal untuk kerajinan tangan dan struktur ramah lingkungan.',
        ]);
        Partner::create([
            'name' => 'EcoPack Solutions',
            'description' => 'Produsen kemasan nabati biodegradable dari pati singkong dan limbah jagung.',
        ]);
        Partner::create([
            'name' => 'Green Logistics',
            'description' => 'Jasa pengiriman lokal menggunakan armada motor listrik rendah karbon.',
        ]);
        Partner::create([
            'name' => 'Sustainable Craft Co.',
            'description' => 'Komunitas pengrajin daur ulang kain perca dan limbah plastik kemasan.',
        ]);
        Partner::create([
            'name' => 'EarthCare Agency',
            'description' => 'Konsultan audit hijau yang membantu standarisasi produk UMKM ramah lingkungan.',
        ]);
    }
}
