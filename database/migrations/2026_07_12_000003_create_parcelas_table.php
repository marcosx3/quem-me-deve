<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('parcelas', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('divida_id');
            $table->unsignedSmallInteger('numero');
            $table->decimal('valor', 10, 2);
            $table->date('vencimento');
            $table->enum('status', ['pendente', 'paga'])->default('pendente');
            $table->dateTime('pago_em')->nullable();
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->unique(['divida_id', 'numero'], 'uq_parcelas_divida_numero');
            $table->index('divida_id', 'idx_parcelas_divida');
            $table->foreign('divida_id', 'fk_parcelas_divida')->references('id')->on('dividas')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parcelas');
    }
};
