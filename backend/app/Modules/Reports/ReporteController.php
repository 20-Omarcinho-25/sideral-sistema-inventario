<?php

namespace App\Modules\Reports;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\Usuario;
use App\Models\Proveedor;
use Barryvdh\DomPDF\Facade\Pdf; // <- Importación de la librería obligatoria

class ReporteController extends Controller
{
    /** GET /api/reportes/ventas/exportar — Exportación en PDF (DomPDF) */
    public function exportarVentasPDF()
    {
        try {
            $ventas = Venta::orderBy('fecha_venta', 'desc')
                ->take(100)
                ->get();

            $pdf = Pdf::loadView('pdf_ventas', compact('ventas'));

            return $pdf->download('reporte_ventas.pdf');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al generar reporte: ' . $e->getMessage()], 500);
        }
    }

    /** GET /api/reportes/eliminados — Reporte de historial de eliminados lógicamente */
    public function reporteEliminados()
    {
        try {
            // 1. Productos eliminados lógicamente (estado = false)
            $productosEliminados = Producto::where('estado', false)
                ->select('id_producto', 'codigo_producto', 'nombre', 'marca', 'precio', 'stock_actual')
                ->get();

            // 2. Usuarios desactivados (estado = false)
            $usuariosDesactivados = Usuario::where('estado', false)
                ->select('id_usuario', 'nombre', 'apellido', 'username', 'correo')
                ->get();

            // 3. Proveedores desactivados (estado = false)
            $proveedoresDesactivados = Proveedor::where('estado', false)
                ->select('id_proveedor', 'razon_social', 'ruc', 'telefono', 'correo')
                ->get();

            return response()->json([
                'productos_eliminados' => $productosEliminados,
                'usuarios_desactivados' => $usuariosDesactivados,
                'proveedores_desactivados' => $proveedoresDesactivados,
                'total_productos' => $productosEliminados->count(),
                'total_usuarios' => $usuariosDesactivados->count(),
                'total_proveedores' => $proveedoresDesactivados->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al generar reporte de eliminados: ' . $e->getMessage()
            ], 500);
        }
    }
}