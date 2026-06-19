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
        'num_serie'    => 'sometimes|required|string|max:15|regex:/^[A-Z0-9-]+$/',
        'nombre'       => 'sometimes|required|string|max:50|regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/',
        'marca'        => 'sometimes|required|string|max:50|regex:/^[a-zA-Z0-9\s-]+$/',
        'precio'       => 'sometimes|required|numeric|min:0.01|max:99999.99',
        'stock_actual' => 'sometimes|required|integer|min:0|max:999',
        'stock_minimo' => 'sometimes|required|integer|min:10|max:999',
        'id_proveedor' => 'sometimes|required|string|max:4|exists:proveedor,id_proveedor',
    ];
}
}
