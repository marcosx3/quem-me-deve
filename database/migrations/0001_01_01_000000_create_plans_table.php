<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->increments('id');
            $table->string('slug', 30);
            $table->string('nome', 60);
            $table->unsignedInteger('preco_centavos')->default(0);
            $table->unsignedInteger('limite_devedores')->nullable();
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->unique('slug', 'uq_plans_slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
