<?php

namespace App\Http\Requests\Devedor;

use Illuminate\Foundation\Http\FormRequest;

class StoreDevedorRequest extends FormRequest
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
            'valor_inicial' => ['nullable', 'numeric', 'min:0.01', 'max:99999999.99'],
            'descricao_inicial' => ['nullable', 'string', 'max:255'],
            'data_vencimento_inicial' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'Informe o nome ou apelido da pessoa.',
            'valor_inicial.min' => 'O valor deve ser de no mínimo R$ 0,01.',
        ];
    }
}
