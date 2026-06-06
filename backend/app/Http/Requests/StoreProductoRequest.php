<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'num_serie'    => 'required|string|max:15',
            'nombre'       => 'required|string|max:50',
            'marca'        => 'required|string|max:50',
            'precio'       => 'required|numeric|min:0.01',
            'stock_actual' => 'required|integer|min:0',
            'stock_minimo' => 'required|integer|min:0',
            'id_proveedor' => 'required|exists:proveedor,id_proveedor',
        ];
    }
}
