<?php

namespace App\Services;

class PixPayloadService
{
    /**
     * Gera o código Pix Copia e Cola (BR Code / EMVCo) padronizado pelo Banco Central do Brasil.
     */
    public function generate(
        string $chave,
        ?string $tipo = null,
        ?float $valor = null,
        ?string $nomeRecebedor = null,
        ?string $cidadeRecebedor = null,
        ?string $txid = '***',
        ?string $descricao = null,
    ): string {
        $chaveLimpa = $this->formatarChave($chave, $tipo);
        $nomeLimpo = $this->sanitizarTexto($nomeRecebedor ?: 'RECEBEDOR', 25);
        $cidadeLimpa = $this->sanitizarTexto($cidadeRecebedor ?: 'SAO PAULO', 15);
        $txidLimpo = $this->sanitizarTexto($txid ?: '***', 25);

        // Subcampos da conta do recebedor (ID 26)
        $conta = $this->emv('00', 'br.gov.bcb.pix')
            . $this->emv('01', $chaveLimpa);

        if ($descricao) {
            $conta .= $this->emv('02', $this->sanitizarTexto($descricao, 25));
        }

        // Subcampo do TXID (ID 62)
        $adicional = $this->emv('05', $txidLimpo);

        $payload = $this->emv('00', '01')                       // Payload Format Indicator
            . $this->emv('26', $conta)                          // Merchant Account Information
            . $this->emv('52', '0000')                          // Merchant Category Code
            . $this->emv('53', '986');                          // Transaction Currency (BRL)

        if ($valor !== null && $valor > 0) {
            $payload .= $this->emv('54', number_format($valor, 2, '.', '')); // Transaction Amount
        }

        $payload .= $this->emv('58', 'BR')                      // Country Code
            . $this->emv('59', $nomeLimpo)                      // Merchant Name
            . $this->emv('60', $cidadeLimpa)                    // Merchant City
            . $this->emv('62', $adicional);                     // Additional Data Field Template

        // Adiciona campo 63 para o CRC16
        $payload .= '6304';
        $payload .= $this->crc16($payload);

        return $payload;
    }

    private function emv(string $id, string $value): string
    {
        $length = str_pad((string) strlen($value), 2, '0', STR_PAD_LEFT);
        return $id . $length . $value;
    }

    private function formatarChave(string $chave, ?string $tipo): string
    {
        $chave = trim($chave);

        if ($tipo === 'cpf' || $tipo === 'cnpj') {
            return preg_replace('/\D/', '', $chave) ?: $chave;
        }

        if ($tipo === 'telefone') {
            $digitos = preg_replace('/\D/', '', $chave) ?: '';
            if (strlen($digitos) === 10 || strlen($digitos) === 11) {
                return '+55' . $digitos;
            }
            if (str_starts_with($digitos, '55') && (strlen($digitos) === 12 || strlen($digitos) === 13)) {
                return '+' . $digitos;
            }
            return $chave;
        }

        return $chave;
    }

    private function sanitizarTexto(string $texto, int $maxLength): string
    {
        // Remove acentos
        $transliterado = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $texto);
        if ($transliterado === false) {
            $transliterado = preg_replace('/[^a-zA-Z0-9 ]/', '', $texto);
        }

        // Mantém apenas caracteres alfanuméricos e espaços
        $limpo = preg_replace('/[^A-Za-z0-9 ]/', '', $transliterado ?? '');
        $limpo = strtoupper(trim($limpo ?: 'RECEBEDOR'));

        return substr($limpo, 0, $maxLength);
    }

    private function crc16(string $payload): string
    {
        $crc = 0xFFFF;
        $length = strlen($payload);

        for ($i = 0; $i < $length; $i++) {
            $crc ^= (ord($payload[$i]) << 8);
            for ($j = 0; $j < 8; $j++) {
                if (($crc & 0x8000) !== 0) {
                    $crc = (($crc << 1) ^ 0x1021) & 0xFFFF;
                } else {
                    $crc = ($crc << 1) & 0xFFFF;
                }
            }
        }

        return strtoupper(str_pad(dechex($crc), 4, '0', STR_PAD_LEFT));
    }
}
