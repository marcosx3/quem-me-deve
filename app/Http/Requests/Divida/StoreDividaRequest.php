<?php

namespace App\Http\Requests\Divida;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDividaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'devedor_id' => [
                'nullable',
                'integer',
                Rule::exists('devedores', 'id')->where('user_id', $this->user()->id),
                'required_without:novo_devedor_nome',
            ],
            'novo_devedor_nome' => ['nullable', 'string', 'max:150', 'required_without:devedor_id'],
            'novo_devedor_telefone' => ['nullable', 'string', 'max:30'],
            'descricao' => ['nullable', 'string', 'max:255'],
            'valor_total' => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'qtd_parcelas' => ['nullable', 'integer', 'min:1', 'max:360'],
            'data_primeira_parcela' => ['nullable', 'date'],
            'multa_percentual' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'juros_mensal_percentual' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'devedor_id.required_without' => 'Selecione quem te deve ou digite um novo nome.',
            'novo_devedor_nome.required_without' => 'Informe o nome de quem te deve.',
            'valor_total.required' => 'Informe o valor que a pessoa te deve.',
            'valor_total.min' => 'O valor precisa ser maior que zero.',
        ];
    }
}
