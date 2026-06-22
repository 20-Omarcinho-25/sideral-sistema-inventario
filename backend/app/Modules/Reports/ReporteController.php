<?php

namespace App\Modules\Reports;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use Barryvdh\DomPDF\Facade\Pdf; // <- Importación de la librería obligatoria

class ReporteController extends Controller
{
    /** GET /api/reportes/ventas/exportar — Exportación en HTML (Alternativa a PDF) */
    public function exportarVentasPDF()
    {
        try {
            // 1. Obtenemos las transacciones sin relaciones complejas para evitar errores
            $ventas = Venta::orderBy('fecha_venta', 'desc')
                ->take(100)
                ->get();

            // 2. Retornamos HTML que el navegador puede imprimir como PDF
            return response()->view('pdf_ventas', compact('ventas'))
                ->header('Content-Type', 'text/html')
                ->header('Content-Disposition', 'inline; filename="reporte_ventas.html"');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al generar reporte: ' . $e->getMessage()], 500);
        }
    }
}