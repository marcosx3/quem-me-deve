<?php

namespace App\Http\Controllers;

use App\Services\RelatorioService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RelatorioController extends Controller
{
    public function __construct(private readonly RelatorioService $relatorios) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $isPremium = ($user->plan_id ?? 1) >= 3;
        $isPro = ($user->plan_id ?? 1) === 2;

        return Inertia::render('relatorios/index', [
            'dados' => $this->relatorios->getDadosRelatorio($user),
            'isPremium' => $isPremium,
            'isPro' => $isPro,
        ]);
    }

    public function exportCsv(Request $request): StreamedResponse
    {
        $user = $request->user();
        $isPremium = ($user->plan_id ?? 1) >= 3;

        abort_unless($isPremium, 403, 'A exportação de dados é um recurso exclusivo do plano Premium.');

        return $this->relatorios->exportCsv($user);
    }
}
