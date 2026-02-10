<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Cari user "azarya" atau "admin" yang sudah ada, atau buat baru
        $user = User::where('username', 'azarya')->orWhere('username', 'admin')->first();

        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Super Admin',
                'username' => 'admin',
                'email' => 'admin@gmail.com',
                'password' => 'dsadsadsa', // Default password
            ]);
        }

        // Buat 5 Task dummy untuk user tersebut
        \App\Models\Task::create([
            'user_id' => $user->user_id,
            'title' => 'Menyelesaikan Implementasi Fitur Login',
            'description' => 'Membuat halaman login dan register serta integrasi dengan API backend.',
            'status' => 'Done',
            'deadline' => '2023-10-25',
            'created_by' => $user->name,
        ]);

        \App\Models\Task::create([
            'user_id' => $user->user_id,
            'title' => 'Membuat Dokumentasi API',
            'description' => 'Menulis dokumentasi endpoint menggunakan Postman Collection.',
            'status' => 'In Progress',
            'deadline' => '2023-10-26',
            'created_by' => $user->name,
        ]);

        \App\Models\Task::create([
            'user_id' => $user->user_id,
            'title' => 'Setup Docker Environment',
            'description' => 'Konfigurasi Dockerfile dan docker-compose.yml agar aplikasi bisa berjalan dengan satu perintah.',
            'status' => 'Done',
            'deadline' => '2023-10-24',
            'created_by' => $user->name,
        ]);

        \App\Models\Task::create([
            'user_id' => $user->user_id,
            'title' => 'Refactor UI Dashboard',
            'description' => 'Mengubah tampilan dashboard menjadi lebih modern menggunakan TailwindCSS.',
            'status' => 'To Do',
            'deadline' => '2023-10-27',
            'created_by' => $user->name,
        ]);

        \App\Models\Task::create([
            'user_id' => $user->user_id,
            'title' => 'Testing Aplikasi',
            'description' => 'Melakukan pengujian fungsionalitas CRUD task dan autentikasi.',
            'status' => 'To Do',
            'deadline' => '2023-10-28',
            'created_by' => $user->name,
        ]);
    }
}
