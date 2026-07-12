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
        // TEXTO: Rango limitado únicamente a letras y espacios
        'nombre_cliente'           => 'required|string|max:50|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/',
        
        // DNI: Cumple automáticamente las 3 reglas (Tipo: entero, Longitud: 8 dígitos, Rango: 00000000 a 99999999)
        'dni_cliente'              => 'required|digits:8',
        
        // ARREGLO: Rango de productos permitidos en una sola transacción (mínimo 1, máximo 50 tipos de laptops)
        'productos'                => 'required|array|min:1|max:999',
        
        // DETALLES DEL ARREGLO
        'productos.*.id_producto'  => 'required|string|max:4|exists:producto,id_producto',
        
        // CANTIDAD: Rango cerrado para evitar que compren cantidades absurdas o negativas por error (mínimo 1, máximo 100 unidades)
        'productos.*.cantidad'     => 'required|integer|min:1|digits_between:1,3',
    ];
}
}
