<?php

namespace App\Http\Controllers;

use App\Http\Requests\Devedor\StoreDevedorRequest;
use App\Http\Requests\Devedor\UpdateDevedorRequest;
use App\Http\Resources\DevedorResource;
use App\Models\Devedor;
use App\Services\DevedorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DevedorController extends Controller
{
    public function __construct(private readonly DevedorService $devedores)
    {
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
        $devedor = $this->devedores->createForUser($request->user(), $request->validated());

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

    public function destroy(Devedor $devedor): RedirectResponse
    {
        Gate::authorize('delete', $devedor);

        $this->devedores->delete($devedor);

        return to_route('devedores.index')->with('success', 'Devedor removido com sucesso.');
    }
}
