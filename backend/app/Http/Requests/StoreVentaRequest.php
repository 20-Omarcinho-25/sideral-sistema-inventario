<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVentaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre_cliente'           => 'required|string|max:50',
            'dni_cliente'              => 'required|digits:8',
            'productos'                => 'required|array|min:1',
            'productos.*.id_producto'  => 'required|exists:producto,id_producto',
            'productos.*.cantidad'     => 'required|integer|min:1',
        ];
    }
}
