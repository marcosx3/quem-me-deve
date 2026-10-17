<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('tipo_chave_pix', 30)->nullable()->after('telefone');
            $table->string('chave_pix', 150)->nullable()->after('tipo_chave_pix');
            $table->string('nome_titular_pix', 100)->nullable()->after('chave_pix');
            $table->string('cidade_titular_pix', 50)->nullable()->after('nome_titular_pix');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'tipo_chave_pix',
                'chave_pix',
                'nome_titular_pix',
                'cidade_titular_pix',
            ]);
        });
    }
};
