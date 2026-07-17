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

    public function messages(): array
    {
        return [
            // Mensajes generales
            'required' => 'El campo :attribute es obligatorio.',
            
            // Número de serie
            'num_serie.max' => 'El número de serie no puede exceder los 15 caracteres.',
            'num_serie.regex' => 'El número de serie solo puede contener mayúsculas, números y guiones.',
            
            // Nombre
            'nombre.max' => 'El nombre no puede exceder los 50 caracteres.',
            'nombre.regex' => 'El nombre solo puede contener letras, números y espacios.',
            
            // Marca
            'marca.max' => 'La marca no puede exceder los 50 caracteres.',
            'marca.regex' => 'La marca solo puede contener letras, números, espacios y guiones.',
            
            // Precio
            'precio.required' => 'El precio es obligatorio.',
            'precio.numeric' => 'El precio debe ser un número válido.',
            'precio.min' => 'El precio debe ser mayor a 0.01.',
            'precio.max' => 'El precio no puede exceder 99,999.99.',
            
            // Stock actual
            'stock_actual.required' => 'El stock actual es obligatorio.',
            'stock_actual.integer' => 'El stock actual debe ser un número entero.',
            'stock_actual.min' => 'El stock no puede ser negativo.',
            'stock_actual.max' => 'El stock actual no puede exceder 999.',
            
            // Stock mínimo
            'stock_minimo.required' => 'El stock mínimo es obligatorio.',
            'stock_minimo.integer' => 'El stock mínimo debe ser un número entero.',
            'stock_minimo.min' => 'El stock mínimo debe ser al menos 10.',
            'stock_minimo.max' => 'El stock mínimo no puede exceder 999.',
            
            // Proveedor
            'id_proveedor.required' => 'Debe seleccionar un proveedor.',
            'id_proveedor.max' => 'El ID de proveedor no es válido.',
            'id_proveedor.exists' => 'El proveedor seleccionado no existe.',
        ];
    }
}
