<?php

namespace App\Http\Controllers;

use App\Http\Requests\Parcela\UpdateParcelaStatusRequest;
use App\Models\Parcela;
use App\Services\ParcelaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;

class ParcelaController extends Controller
{
    public function __construct(private readonly ParcelaService $parcelas)
    {
    }

    public function update(UpdateParcelaStatusRequest $request, Parcela $parcela): RedirectResponse
    {
        Gate::authorize('update', $parcela);

        $parcela = $request->validated('status') === 'paga'
            ? $this->parcelas->marcarPaga($parcela)
            : $this->parcelas->marcarPendente($parcela);

        return back()->with(
            'success',
            $parcela->status === 'paga' ? 'Parcela marcada como paga.' : 'Baixa da parcela desfeita.'
        );
    }
}
