<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'tipo_chave_pix' => ['nullable', 'string', 'in:cpf,cnpj,telefone,email,aleatoria'],
            'chave_pix' => ['nullable', 'string', 'max:150'],
            'nome_titular_pix' => ['nullable', 'string', 'max:100'],
            'cidade_titular_pix' => ['nullable', 'string', 'max:50'],
        ];
    }
}
