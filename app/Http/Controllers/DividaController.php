<?php

namespace App\Http\Controllers;

use App\Http\Requests\Divida\StoreDividaRequest;
use App\Http\Requests\Divida\UpdateDividaRequest;
use App\Http\Resources\DividaResource;
use App\Http\Resources\ParcelaResource;
use App\Models\Divida;
use App\Services\DividaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DividaController extends Controller
{
    public function __construct(private readonly DividaService $dividas)
    {
    }

    public function index(Request $request): Response
    {
        $search = $request->string('q')->toString() ?: null;
        $status = $request->string('status')->toString() ?: null;

        return Inertia::render('dividas/index', [
            'dividas' => DividaResource::collection(
                $this->dividas->listForUser($request->user(), $search, $status)
            ),
            'filters' => ['q' => $search, 'status' => $status],
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('dividas/create', [
            'devedores' => $request->user()->devedores()->orderBy('nome')->get(['id', 'nome']),
            'devedorSelecionadoId' => $request->integer('devedor_id') ?: null,
        ]);
    }

    public function store(StoreDividaRequest $request): RedirectResponse
    {
        $this->dividas->createForUser($request->user(), $request->validated());

        return to_route('dividas.index')->with('success', 'Dívida cadastrada com sucesso.');
    }

    public function edit(Request $request, Divida $divida): Response
    {
        Gate::authorize('view', $divida);

        return Inertia::render('dividas/edit', [
            'divida' => (new DividaResource($divida))->resolve(),
            'devedores' => $request->user()->devedores()->orderBy('nome')->get(['id', 'nome']),
            'parcelas' => $divida->parcelas()
                ->orderBy('numero')
                ->get()
                ->map(fn ($parcela) => (new ParcelaResource($parcela))->resolve())
                ->all(),
        ]);
    }

    public function update(UpdateDividaRequest $request, Divida $divida): RedirectResponse
    {
        Gate::authorize('update', $divida);

        $this->dividas->updateForUser($divida, $request->validated());

        return to_route('dividas.index')->with('success', 'Dívida atualizada com sucesso.');
    }

    public function destroy(Divida $divida): RedirectResponse
    {
        Gate::authorize('delete', $divida);

        $this->dividas->delete($divida);

        return to_route('dividas.index')->with('success', 'Dívida removida com sucesso.');
    }
}
