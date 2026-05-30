<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RoleAndUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Spatie Roles for API guard
        $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'api']);
        $instructorRole = Role::create(['name' => 'instructor', 'guard_name' => 'api']);
        $studentRole = Role::create(['name' => 'student', 'guard_name' => 'api']);

        // 2. Seed Users
        $admin = User::create([
            'name' => 'Admin Ecocademy',
            'email' => 'admin@ecocademy.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'bio' => 'Administrator platform Eco Academy. Bertanggung jawab atas kualitas konten dan kemitraan UMKM.',
        ]);
        $admin->assignRole('admin');

        $instructor = User::create([
            'name' => 'Dr. Rian Hermawan',
            'email' => 'instructor@ecocademy.com',
            'password' => Hash::make('password'),
            'role' => 'instructor',
            'bio' => 'Dosen Kewirausahaan Sosial & Konsultan Ekonomi Sirkular tingkat nasional dengan pengalaman 10+ tahun membimbing UMKM.',
        ]);
        $instructor->assignRole('instructor');

        $student = User::create([
            'name' => 'Budi Santoso',
            'email' => 'student@ecocademy.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'bio' => 'Mahasiswa tingkat akhir Teknik Lingkungan yang berfokus pada teknologi daur ulang sampah organik dan keberlanjutan lokal.',
        ]);
        $student->assignRole('student');

        $student2 = User::create([
            'name' => 'Siti Aminah',
            'email' => 'student2@ecocademy.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'bio' => 'Mahasiswa Bisnis Digital yang tertarik pada branding produk ramah lingkungan dan green marketing.',
        ]);
        $student2->assignRole('student');
    }
}
