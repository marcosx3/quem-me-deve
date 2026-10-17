<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PlanSeeder::class);

        if (! User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        $adminEmail = 'marcos-oliveirasilva@hotmail.com';
        $admin = User::whereRaw('LOWER(email) = ?', [$adminEmail])->first();
        if (! $admin) {
            User::forceCreate([
                'name' => 'Marcos Oliveira',
                'email' => $adminEmail,
                'password_hash' => bcrypt('admin123'),
                'is_admin' => true,
                'plan_id' => 3,
            ]);
        } else {
            $admin->update([
                'is_admin' => true,
                'plan_id' => 3,
            ]);
        }
    }
}
