<?php

use App\Http\Controllers\AbacatePayWebhookController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DevedorController;
use App\Http\Controllers\DividaController;
use App\Http\Controllers\ParcelaController;
use App\Http\Controllers\RelatorioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Webhook do AbacatePay (isento de CSRF em bootstrap/app.php)
Route::post('api/webhooks/abacatepay', [AbacatePayWebhookController::class, 'handle'])->name('webhooks.abacatepay');

// Retorno do checkout
Route::get('checkout/callback/{user}', [CheckoutController::class, 'callback'])->name('checkout.callback');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('termos-de-uso', function () {
    return Inertia::render('termos');
})->name('termos');

Route::get('politica-de-privacidade', function () {
    return Inertia::render('privacidade');
})->name('privacidade');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // 'destroy' fica de fora de propósito: devedor não pode ser excluído, senão dá pra burlar
    // o limite de devedores do plano excluindo e recriando.
    Route::resource('devedores', DevedorController::class)
        ->except(['show', 'destroy'])
        ->parameters(['devedores' => 'devedor']);

    Route::resource('dividas', DividaController::class)
        ->except('show')
        ->parameters(['dividas' => 'divida']);

    Route::patch('parcelas/{parcela}', [ParcelaController::class, 'update'])->name('parcelas.update');
    Route::patch('parcelas/{parcela}/vencimento', [ParcelaController::class, 'updateVencimento'])->name('parcelas.vencimento.update');
    Route::get('parcelas/{parcela}/pix', [ParcelaController::class, 'pix'])->name('parcelas.pix');

    Route::get('relatorios', [RelatorioController::class, 'index'])->name('relatorios.index');
    Route::get('relatorios/export/csv', [RelatorioController::class, 'exportCsv'])->name('relatorios.export.csv');

    Route::post('checkout/upgrade', [CheckoutController::class, 'upgrade'])->name('checkout.upgrade');
    Route::post('checkout/simulate', [CheckoutController::class, 'simulate'])->name('checkout.simulate');

    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::patch('users/{user}/plan', [AdminController::class, 'updatePlan'])->name('users.plan');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
