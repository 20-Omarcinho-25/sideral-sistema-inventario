// app/Http/Requests/StoreProductoRequest.php
class StoreProductoRequest extends FormRequest {
    public function rules(): array {
        return [
            'num_serie'    => 'required|string|max:15',
            'nombre'       => 'required|string|max:50',
            'marca'        =g> 'required|string|max:50',
            'precio'       => 'required|numeric|min:0.01|decimal:0,2',
            'stock_actual' => 'required|integer|min:0',
            'stock_minimo' => 'required|integer|min:0',
            'id_proveedor' => 'required|exists:proveedor,id_proveedor',
        ];
    }
    // HTTP 422 automatico si falla la validacion
}
