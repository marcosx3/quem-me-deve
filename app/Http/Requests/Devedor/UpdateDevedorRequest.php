<?php

namespace App\Http\Requests\Devedor;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDevedorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:150'],
            'telefone' => ['nullable', 'string', 'max:30'],
            'observacoes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
