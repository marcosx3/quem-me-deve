<?php

namespace App\Http\Controllers;

use App\Http\Requests\Devedor\StoreDevedorRequest;
use App\Http\Requests\Devedor\UpdateDevedorRequest;
use App\Http\Resources\DevedorResource;
use App\Models\Devedor;
use App\Services\DevedorService;
use App\Services\DividaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DevedorController extends Controller
{
    public function __construct(
        private readonly DevedorService $devedores,
        private readonly DividaService $dividas,
    ) {
    }

    public function index(Request $request): Response
    {
        $search = $request->string('q')->toString() ?: null;

        return Inertia::render('devedores/index', [
            'devedores' => DevedorResource::collection(
                $this->devedores->listForUser($request->user(), $search)
            ),
            'filters' => ['q' => $search],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('devedores/create');
    }

    public function store(StoreDevedorRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $user = $request->user();

        $devedor = $this->devedores->createForUser($user, [
            'nome' => trim($data['nome']),
            'telefone' => !empty($data['telefone']) ? trim($data['telefone']) : null,
            'observacoes' => !empty($data['observacoes']) ? trim($data['observacoes']) : null,
        ]);

        // Se informou valor inicial, cria a dívida imediatamente sem burocracia
        if (!empty($data['valor_inicial'])) {
            $this->dividas->createForUser($user, [
                'devedor_id' => $devedor->id,
                'descricao' => !empty($data['descricao_inicial']) ? trim($data['descricao_inicial']) : 'Empréstimo',
                'valor_total' => $data['valor_inicial'],
                'qtd_parcelas' => 1,
                'data_primeira_parcela' => !empty($data['data_vencimento_inicial'])
                    ? $data['data_vencimento_inicial']
                    : now()->addDays(30)->toDateString(),
            ]);

            return to_route('dividas.index')
                ->with('success', "Devedor {$devedor->nome} e dívida registrados com sucesso!");
        }

        return to_route('devedores.index')
            ->with('success', 'Devedor cadastrado com sucesso.')
            ->with('devedorCriado', ['id' => $devedor->id, 'nome' => $devedor->nome]);
    }

    public function edit(Request $request, Devedor $devedor): Response
    {
        Gate::authorize('view', $devedor);

        return Inertia::render('devedores/edit', [
            'devedor' => (new DevedorResource($devedor))->resolve(),
        ]);
    }

    public function update(UpdateDevedorRequest $request, Devedor $devedor): RedirectResponse
    {
        Gate::authorize('update', $devedor);

        $this->devedores->updateForUser($request->user(), $devedor, $request->validated());

        return to_route('devedores.index')->with('success', 'Devedor atualizado com sucesso.');
    }
}
