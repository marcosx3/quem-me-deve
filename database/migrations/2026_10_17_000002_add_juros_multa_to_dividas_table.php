<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dividas', function (Blueprint $table) {
            $table->decimal('multa_percentual', 5, 2)->nullable()->after('data_primeira_parcela');
            $table->decimal('juros_mensal_percentual', 5, 2)->nullable()->after('multa_percentual');
        });
    }

    public function down(): void
    {
        Schema::table('dividas', function (Blueprint $table) {
            $table->dropColumn(['multa_percentual', 'juros_mensal_percentual']);
        });
    }
};
