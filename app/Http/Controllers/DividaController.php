<?php

namespace App\Http\Controllers;

use App\Http\Requests\Divida\StoreDividaRequest;
use App\Http\Requests\Divida\UpdateDividaRequest;
use App\Http\Resources\DividaResource;
use App\Http\Resources\ParcelaResource;
use App\Models\Divida;
use App\Services\DevedorService;
use App\Services\DividaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DividaController extends Controller
{
    public function __construct(
        private readonly DividaService $dividas,
        private readonly DevedorService $devedores,
    ) {
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
        $data = $request->validated();
        $user = $request->user();

        // Se informou um novo devedor, cria-o automaticamente
        if (empty($data['devedor_id']) && !empty($data['novo_devedor_nome'])) {
            $devedor = $this->devedores->createForUser($user, [
                'nome' => trim($data['novo_devedor_nome']),
                'telefone' => !empty($data['novo_devedor_telefone']) ? trim($data['novo_devedor_telefone']) : null,
            ]);
            $data['devedor_id'] = $devedor->id;
        }

        // Padrões amigáveis para quem quer apenas registrar sem burocracia
        if (empty($data['descricao'])) {
            $data['descricao'] = 'Empréstimo';
        }

        if (empty($data['qtd_parcelas'])) {
            $data['qtd_parcelas'] = 1;
        }

        if (empty($data['data_primeira_parcela'])) {
            $data['data_primeira_parcela'] = now()->addDays(30)->toDateString();
        }

        if (! empty($data['multa_percentual']) || ! empty($data['juros_mensal_percentual'])) {
            $isPremium = ($user->plan_id ?? 1) >= 3;
            if (! $isPremium) {
                $data['multa_percentual'] = null;
                $data['juros_mensal_percentual'] = null;
            }
        }

        unset($data['novo_devedor_nome'], $data['novo_devedor_telefone']);

        $this->dividas->createForUser($user, $data);

        return to_route('dividas.index')->with('success', 'Dívida registrada com sucesso.');
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

        $data = $request->validated();
        $isPremium = ($request->user()->plan_id ?? 1) >= 3;

        if (! $isPremium) {
            $data['multa_percentual'] = null;
            $data['juros_mensal_percentual'] = null;
        }

        $this->dividas->updateForUser($divida, $data);

        return to_route('dividas.index')->with('success', 'Dívida atualizada com sucesso.');
    }

    public function destroy(Divida $divida): RedirectResponse
    {
        Gate::authorize('delete', $divida);

        $this->dividas->delete($divida);

        return to_route('dividas.index')->with('success', 'Dívida removida com sucesso.');
    }
}
