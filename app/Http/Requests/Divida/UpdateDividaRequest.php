<?php

namespace App\Http\Requests\Divida;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDividaRequest extends FormRequest
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
            'status' => ['required', Rule::in(['aberta', 'quitada'])],
        ];
    }
}
