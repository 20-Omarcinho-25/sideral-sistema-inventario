<?php

namespace App\Modules\Reports;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use Barryvdh\DomPDF\Facade\Pdf; // <- Importación de la librería obligatoria

class ReporteController extends Controller
{
    /** GET /api/reportes/ventas/exportar — Exportación en PDF (Requisito mínimo) */
    public function exportarVentasPDF()
    {
        // 1. Obtenemos las transacciones (Limitamos a las últimas 100 para no agotar la RAM de DomPDF)
        $ventas = Venta::orderBy('fecha_venta', 'desc')->take(100)->get();

        // 2. Patrón Decorator: Cargamos una vista HTML (Blade) y la "decoramos" con los datos
        $pdf = Pdf::loadView('pdf_ventas', compact('ventas'));

        // 3. Descargamos el archivo con la nomenclatura exigida
        $nombreArchivo = 'Sideral_Reporte_Ventas_' . now()->format('Ymd_His') . '.pdf';
        
        return $pdf->download($nombreArchivo);
    }
}