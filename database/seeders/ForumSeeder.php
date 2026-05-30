<?php

namespace Database\Seeders;

use App\Models\ForumComment;
use App\Models\ForumThread;
use App\Models\User;
use Illuminate\Database\Seeder;

class ForumSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::query()->where('email', 'student@ecocademy.com')->first();
        $student2 = User::query()->where('email', 'student2@ecocademy.com')->first();
        $instructor = User::query()->where('email', 'instructor@ecocademy.com')->first();

        if (!$student || !$student2 || !$instructor) {
            return;
        }

        $thread1 = ForumThread::create([
            'user_id' => $student->id,
            'title' => 'Cara mengatasi bau menyengat pada komposter anaerob di dapur UMKM?',
            'body' => 'Halo semuanya, saat ini saya sedang membantu warung makan mitra untuk memasang komposter anaerob di area belakang dapur mereka. Namun, mereka khawatir dengan bau sampah sayur yang menyengat. Apakah ada kiat khusus untuk meminimalkan bau selama proses dekomposisi berlangsung?',
        ]);

        ForumComment::create([
            'thread_id' => $thread1->id,
            'user_id' => $instructor->id,
            'body' => 'Halo Budi, pastikan tong komposter benar-benar kedap udara (seal karet rapat). Selain itu, taburkan abu kayu kering atau sekam padi di lapisan atas setiap kali limbah basah dimasukkan, hal ini dapat mengikat amonia gas pemicu bau.',
        ]);

        ForumComment::create([
            'thread_id' => $thread1->id,
            'user_id' => $student2->id,
            'body' => 'Saya juga menggunakan bioaktivator seperti Molase tape/EM4, Kak Budi! Selain mempercepat pembusukan, cairan ini menghasilkan aroma fermentasi asam manis seperti tape ketimbang bau busuk sampah.',
        ]);
    }
}
