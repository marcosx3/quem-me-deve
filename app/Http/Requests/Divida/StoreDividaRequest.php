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
                'required',
                'integer',
                Rule::exists('devedores', 'id')->where('user_id', $this->user()->id),
            ],
            'descricao' => ['required', 'string', 'max:255'],
            'valor_total' => ['required', 'numeric', 'min:0.01', 'max:99999999.99'],
            'qtd_parcelas' => ['required', 'integer', 'min:1', 'max:360'],
            'data_primeira_parcela' => ['required', 'date'],
        ];
    }
}
