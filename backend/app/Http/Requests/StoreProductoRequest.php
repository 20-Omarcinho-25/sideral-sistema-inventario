<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // En un futuro aquí puedes validar si el usuario tiene rol de Admin
    }

    public function rules(): array
{
    return [
        // TEXTOS: Se añade regex para definir el rango estricto de caracteres aceptados (Alfanuméricos y guiones)
        'num_serie'    => 'required|string|max:15|regex:/^[A-Z0-9-]+$/',
        'nombre'       => 'required|string|max:50|regex:/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/',
        'marca'        => 'required|string|max:50|regex:/^[a-zA-Z0-9\s-]+$/',
        
        // NÚMEROS: Se añade el parámetro '|max:...' para cerrar el RANGO lógico de valores y evitar desbordamientos
        'precio'       => 'required|numeric|min:0.01|max:99999.99',
        'stock_actual' => 'required|integer|min:0|digits_between:1,3',
        'stock_minimo' => 'required|integer|min:10|digits_between:1,3',

        // LLAVE FORÁNEA: Se valida Tipo y Longitud del ID antes de verificar su existencia en la BD
        'id_proveedor' => 'required|string|max:4|exists:proveedor,id_proveedor',
    ];
}

    // Opcional pero recomendado: Mensajes en español para tu API
    public function messages(): array
    {
        return [
            'precio.min' => 'El precio debe ser mayor a 0.',
            'stock_actual.min' => 'El stock no puede ser negativo.',
            'nombre.max' => 'El nombre no puede exceder los 50 caracteres.',
        ];
    }
}