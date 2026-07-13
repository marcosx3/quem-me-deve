<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dividas', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('devedor_id');
            $table->string('descricao', 255);
            $table->decimal('valor_total', 10, 2);
            $table->unsignedSmallInteger('qtd_parcelas');
            $table->date('data_primeira_parcela');
            $table->enum('status', ['aberta', 'quitada'])->default('aberta');
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->index('user_id', 'idx_dividas_user');
            $table->index('devedor_id', 'idx_dividas_devedor');
            $table->foreign('user_id', 'fk_dividas_user')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('devedor_id', 'fk_dividas_devedor')->references('id')->on('devedores')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dividas');
    }
};
