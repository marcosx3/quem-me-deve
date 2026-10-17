<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_access_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('user_id')->nullable()->index();
            $table->string('path', 255)->index();
            $table->string('method', 10)->default('GET');
            $table->string('ip_hash', 64)->index();
            $table->string('user_agent', 500)->nullable();
            $table->string('referer', 500)->nullable();
            $table->timestamp('created_at')->useCurrent()->index();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_access_logs');
    }
};
