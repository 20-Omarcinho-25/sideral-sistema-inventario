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
            'num_serie'       => 'required|string|max:15|regex:/^[A-Z0-9-]+$/',
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
            'stock_actual.digits_between' => 'El stock actual debe estar entre 0 y 999.',
            
            // Stock mínimo
            'stock_minimo.required' => 'El stock mínimo es obligatorio.',
            'stock_minimo.integer' => 'El stock mínimo debe ser un número entero.',
            'stock_minimo.min' => 'El stock mínimo debe ser al menos 10.',
            'stock_minimo.digits_between' => 'El stock mínimo debe estar entre 10 y 999.',
            
            // Proveedor
            'id_proveedor.required' => 'Debe seleccionar un proveedor.',
            'id_proveedor.max' => 'El ID de proveedor no es válido.',
            'id_proveedor.exists' => 'El proveedor seleccionado no existe.',
        ];
    }
}