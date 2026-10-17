<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('plan_id');
        });

        // Garante que o proprietário seja Super Admin
        DB::table('users')
            ->whereRaw('LOWER(email) = ?', ['marcos-oliveirasilva@hotmail.com'])
            ->update([
                'is_admin' => true,
                'plan_id' => 3, // Premium
            ]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_admin');
        });
    }
};
