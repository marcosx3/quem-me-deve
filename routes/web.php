<?php

use App\Http\Controllers\DevedorController;
use App\Http\Controllers\DividaController;
use App\Http\Controllers\ParcelaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('devedores', DevedorController::class)
        ->except('show')
        ->parameters(['devedores' => 'devedor']);

    Route::resource('dividas', DividaController::class)
        ->except('show')
        ->parameters(['dividas' => 'divida']);

    Route::patch('parcelas/{parcela}', [ParcelaController::class, 'update'])->name('parcelas.update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
