<?php

namespace App\Services;

use App\Models\Divida;
use App\Models\Parcela;
use App\Repositories\Contracts\DividaRepositoryInterface;
use App\Repositories\Contracts\ParcelaRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ParcelaService
{
    public function __construct(
        private readonly ParcelaRepositoryInterface $parcelas,
        private readonly DividaRepositoryInterface $dividas,
    ) {
    }

    public function marcarPaga(Parcela $parcela): Parcela
    {
        return DB::transaction(function () use ($parcela) {
            $parcela = $this->parcelas->update($parcela, [
                'status' => 'paga',
                'pago_em' => now(),
            ]);

            $this->sincronizarStatusDivida($parcela->divida);

            return $parcela;
        });
    }

    public function marcarPendente(Parcela $parcela): Parcela
    {
        return DB::transaction(function () use ($parcela) {
            $parcela = $this->parcelas->update($parcela, [
                'status' => 'pendente',
                'pago_em' => null,
            ]);

            $this->sincronizarStatusDivida($parcela->divida);

            return $parcela;
        });
    }

    public function atualizarVencimento(Parcela $parcela, string $vencimento): Parcela
    {
        return $this->parcelas->update($parcela, ['vencimento' => $vencimento]);
    }

    /**
     * O status da dívida é derivado das parcelas: só é "quitada" quando todas estiverem pagas.
     */
    private function sincronizarStatusDivida(Divida $divida): void
    {
        $todasPagas = ! $divida->parcelas()->where('status', '!=', 'paga')->exists();

        $this->dividas->update($divida, [
            'status' => $todasPagas ? 'quitada' : 'aberta',
        ]);
    }
}
