<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'num_serie'    => 'sometimes|required|string|max:15',
            'nombre'       => 'sometimes|required|string|max:50',
            'marca'        => 'sometimes|required|string|max:50',
            'precio'       => 'sometimes|required|numeric|min:0.01',
            'stock_actual' => 'sometimes|required|integer|min:0',
            'stock_minimo' => 'sometimes|required|integer|min:0',
            'id_proveedor' => 'sometimes|required|exists:proveedor,id_proveedor',
        ];
    }
}
