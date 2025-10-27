<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MailFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function attributes(): array
    {
        return [
            'name'    => 'Имя',
            'email'   => 'Email',
            'subject' => 'Тема',
            'phone'   => 'Телефон',
            'message' => 'Сообщение',
        ];
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required | min:3 | alpha',
            'email' => 'email:rfc,dns',
            'subject' => 'nullable | min:5',
            'phone' => 'nullable | min:5',
            'message' => 'nullable | min:10',
        ];
    }
}