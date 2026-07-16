<?php

namespace App\Http\Requests\Parcela;

use Illuminate\Foundation\Http\FormRequest;

class UpdateParcelaVencimentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vencimento' => ['required', 'date'],
        ];
    }
}
