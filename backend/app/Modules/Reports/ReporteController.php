<?php

namespace App\Modules\Reports;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Producto;
use App\Models\Usuario;
use App\Models\Proveedor;
use App\Models\ConteoInventario;
use App\Models\ConsultaStock;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\MetaTrimestral;
use App\Models\Entregable;

class ReporteController extends Controller
{
    /** GET /api/reportes/ventas/exportar — Exportación en PDF con DomPDF */
    public function exportarVentasPDF()
    {
        try {
            $ventas = Venta::orderBy('fecha_venta', 'desc')
                ->take(100)
                ->get();

            return Pdf::loadView('pdf_ventas', compact('ventas'))
                ->setPaper('a4', 'portrait')
                ->download('reporte_ventas.pdf');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al generar reporte: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Reporte 1 — GET /api/reportes/estadisticas?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
     * Máximo, mínimo y promedio del total vendido en un rango de fechas,
     * considerando únicamente ventas con estado "Completada".
     * Genera PDF directamente con DomPDF.
     */
    public function reporteEstadisticas(Request $request)
    {
        try {
            $request->validate([
                'desde' => 'required|date',
                'hasta' => 'required|date',
            ]);

            $desde = Carbon::parse($request->desde)->startOfDay();
            $hasta = Carbon::parse($request->hasta)->endOfDay();

            $query = Venta::where('estado', 'Completada')
                ->whereBetween('fecha_venta', [$desde, $hasta]);

            $ventas = (clone $query)->orderBy('fecha_venta')->get();

            $resumen = [
                'total_transacciones' => (clone $query)->count(),
                'maximo'   => (clone $query)->max('total') ?? 0,
                'minimo'   => (clone $query)->min('total') ?? 0,
                'promedio' => round((clone $query)->avg('total') ?? 0, 2),
            ];

            return Pdf::loadView('reportes.pdf_estadisticas', compact('ventas', 'resumen', 'desde', 'hasta'))
                ->setPaper('a4', 'portrait')
                ->download('reporte_estadistico.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al generar reporte estadístico: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reporte 2 — GET /api/reportes/eliminados
     * Historial de registros con eliminación lógica (estado = false)
     * en producto, usuario y proveedor. Genera PDF directamente con DomPDF.
     */
    public function reporteEliminados()
    {
        try {
            $productos = Producto::where('estado', false)
                ->select('id_producto', 'num_serie', 'nombre', 'marca', 'precio', 'stock_actual')
                ->get();

            $usuarios = Usuario::where('estado', false)
                ->select('id_usuario', 'nombre', 'apellido', 'username', 'correo')
                ->get();

            $proveedores = Proveedor::where('estado', false)
                ->select('id_proveedor', 'razon_social', 'ruc', 'telefono', 'correo')
                ->get();

            return Pdf::loadView('reportes.pdf_eliminados', compact('productos', 'usuarios', 'proveedores'))
                ->setPaper('a4', 'portrait')
                ->download('reporte_eliminados.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al generar reporte de eliminados: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reporte 3 — GET /api/reportes/kpis?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
     * Tablero con los 4 indicadores de gestión del Capítulo 1 (sección 1.2.2).
     * Genera PDF directamente con DomPDF.
     */
    public function reporteKpis(Request $request)
    {
        try {
            $request->validate([
                'desde' => 'required|date',
                'hasta' => 'required|date',
            ]);

            $desde = Carbon::parse($request->desde)->startOfDay();
            $hasta = Carbon::parse($request->hasta)->endOfDay();

            $kpis = [
                $this->calcularEri($desde, $hasta),
                $this->calcularTpvs($desde, $hasta),
                $this->calcularRenovacion($desde, $hasta),
                $this->calcularTvces($desde, $hasta),
            ];

            return Pdf::loadView('reportes.pdf_kpis', compact('kpis', 'desde', 'hasta'))
                ->setPaper('a4', 'portrait')
                ->download('reporte_kpis.pdf');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al generar tablero de indicadores: ' . $e->getMessage()
            ], 500);
        }
    }



        /**
     * Reporte 4 — GET /api/reportes/ingresos
     *
     * Muestra los ingresos y ventas acumuladas.
     * Solo considera ventas con estado "Completada".
     * Excluye ventas "Anulada" y "En proceso".
     *
     * Parámetros opcionales:
     * desde=YYYY-MM-DD
     * hasta=YYYY-MM-DD
     */
    public function reporteIngresos(Request $request)
    {
        $request->validate([
            'desde' => 'nullable|date|required_with:hasta',
            'hasta' => 'nullable|date|required_with:desde|after_or_equal:desde',
        ]);

        try {
            // Regla principal:
            // únicamente se consideran ventas completadas.
            $consulta = Venta::where('estado', 'Completada');

            $desde = null;
            $hasta = null;

            // Si el usuario seleccionó ambas fechas, se aplica el filtro.
            if ($request->filled('desde') && $request->filled('hasta')) {
                $desde = Carbon::parse($request->desde)->startOfDay();
                $hasta = Carbon::parse($request->hasta)->endOfDay();

                $consulta->whereBetween('fecha_venta', [$desde, $hasta]);
            }

            // Detalle de las ventas completadas.
            $ventas = $consulta
                ->orderBy('fecha_venta', 'asc')
                ->get();

            // Datos generales.
            $numeroVentas = $ventas->count();
            $totalIngresos = (float) $ventas->sum('total');

            // Agrupación de ingresos por día.
            $ingresosPorDia = $ventas
                ->groupBy(function ($venta) {
                    return Carbon::parse($venta->fecha_venta)
                        ->format('Y-m-d');
                })
                ->map(function ($ventasDelDia, $fecha) {
                    return [
                        'fecha' => $fecha,
                        'cantidad_ventas' => $ventasDelDia->count(),
                        'ingresos_dia' => (float) $ventasDelDia->sum('total'),
                    ];
                })
                ->values();

            // Texto que aparecerá en el PDF.
            $periodo = [
                'desde' => $desde
                    ? $desde->format('d/m/Y')
                    : null,

                'hasta' => $hasta
                    ? $hasta->format('d/m/Y')
                    : null,
            ];

            return Pdf::loadView(
                'reportes.pdf_ingresos',
                compact(
                    'ventas',
                    'numeroVentas',
                    'totalIngresos',
                    'ingresosPorDia',
                    'periodo'
                )
            )
                ->setPaper('a4', 'portrait')
                ->download('reporte_ingresos.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'message' =>
                    'Error al generar el reporte de ingresos: '
                    . $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Reporte 5 — GET /api/reportes/metas
     *
     * Compara la meta planificada contra las ventas completadas
     * de un trimestre y calcula el porcentaje de cumplimiento.
     *
     * Parámetros:
     * trimestre = 1, 2, 3 o 4
     * anio = año que se desea evaluar
     */
    public function reporteMetas(Request $request)
    {
        $request->validate([
            'trimestre' => 'required|integer|between:1,4',
            'anio' => 'required|integer|between:2000,2100',
        ]);

        try {
            $trimestre = (int) $request->trimestre;
            $anio = (int) $request->anio;

            // Calcula el primer mes del trimestre:
            // T1 = enero, T2 = abril, T3 = julio, T4 = octubre.
            $mesInicial = (($trimestre - 1) * 3) + 1;

            $desde = Carbon::create(
                $anio,
                $mesInicial,
                1
            )->startOfDay();

            $hasta = $desde
                ->copy()
                ->addMonths(3)
                ->subSecond();

            // Busca la meta activa del trimestre seleccionado.
            $meta = MetaTrimestral::where('estado', true)
                ->where('trimestre', $trimestre)
                ->where('anio', $anio)
                ->first();

            if (!$meta) {
                return response()->json([
                    'message' =>
                        'No existe una meta activa para el trimestre y año seleccionados.',
                ], 404);
            }

            // Solo se consideran ventas completadas.
            $consultaVentas = Venta::where('estado', 'Completada')
                ->whereBetween('fecha_venta', [$desde, $hasta]);

            $cantidadVentas = (clone $consultaVentas)->count();

            $logrado = (float) (clone $consultaVentas)
                ->sum('total');

            $metaPlanificada = (float) $meta->meta_planificada;

            // Evita división entre cero.
            $avance = $metaPlanificada > 0
                ? round(
                    ($logrado / $metaPlanificada) * 100,
                    1
                )
                : 0;

            $estadoCumplimiento = $avance >= 100
                ? 'Cumplido'
                : 'En riesgo';

            $diferencia = round(
                $logrado - $metaPlanificada,
                2
            );

            return Pdf::loadView(
                'reportes.metas',
                compact(
                    'meta',
                    'trimestre',
                    'anio',
                    'desde',
                    'hasta',
                    'cantidadVentas',
                    'metaPlanificada',
                    'logrado',
                    'diferencia',
                    'avance',
                    'estadoCumplimiento'
                )
            )
                ->setPaper('a4', 'portrait')
                ->download(
                    "reporte_metas_T{$trimestre}_{$anio}.pdf"
                );

        } catch (\Exception $e) {
            return response()->json([
                'message' =>
                    'Error al generar el reporte de metas: '
                    . $e->getMessage(),
            ], 500);
        }
    }


    /**
     * Reporte 6 — Volumen de Entregables Aceptados.
     *
     * Calcula el avance físico del proyecto usando únicamente
     * entregables activos y muestra los que fueron aceptados.
     */
    public function reporteEntregables()
    {
        try {
            // Todos los entregables activos forman parte del total.
            $total = Entregable::where('estado', true)->count();

            // Solo se muestran los entregables activos y aceptados.
            $aceptados = Entregable::where('estado', true)
                ->where('aceptado', true)
                ->orderBy('fecha_aceptacion', 'asc')
                ->get();

            $cantidadAceptados = $aceptados->count();

            // Evita división entre cero si no existen entregables activos.
            $avance = $total > 0
                ? round(($cantidadAceptados / $total) * 100, 1)
                : 0;

            return Pdf::loadView(
                'reportes.entregables',
                compact(
                    'aceptados',
                    'cantidadAceptados',
                    'total',
                    'avance'
                )
            )
                ->setPaper('a4', 'portrait')
                ->download('reporte_entregables.pdf');

        } catch (\Exception $e) {
            return response()->json([
                'message' =>
                    'Error al generar el reporte de entregables: '
                    . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * KPI 1 — Exactitud del Inventario (ERI)
     * ERI = (unidades contadas físicamente / unidades registradas) x 100
     * Requiere registros en la tabla de apoyo conteo_inventario dentro del periodo.
     */
    private function calcularEri(Carbon $desde, Carbon $hasta): array
    {
        $conteos = ConteoInventario::where('estado', true)
            ->whereBetween('fecha', [$desde, $hasta])
            ->get();

        if ($conteos->isEmpty()) {
            return $this->kpiPendiente(
                'Exactitud del Inventario (ERI)',
                'ERI = (Unidades contadas físicamente / Unidades registradas) x 100'
            );
        }

        $unidadesContadas = $conteos->sum('unidades_contadas');
        $idsProductos = $conteos->pluck('id_producto')->unique();
        $unidadesRegistradas = Producto::whereIn('id_producto', $idsProductos)->sum('stock_actual');

        $eri = $unidadesRegistradas > 0
            ? round(($unidadesContadas / $unidadesRegistradas) * 100, 2)
            : 0;

        $semaforo = $eri >= 95 ? 'verde' : ($eri >= 85 ? 'ambar' : 'rojo');

        return [
            'nombre'      => 'Exactitud del Inventario (ERI)',
            'formula'     => 'ERI = (Unidades contadas físicamente / Unidades registradas) x 100',
            'valor_texto' => $eri . ' %',
            'semaforo'    => $semaforo,
        ];
    }

    /**
     * KPI 2 — Tiempo Promedio de Verificación de Stock (TPVS)
     * TPVS = Σ minutos de conteos / N° de consultas de stock
     * Requiere registros en la tabla de apoyo consulta_stock dentro del periodo.
     */
    private function calcularTpvs(Carbon $desde, Carbon $hasta): array
    {
        $consultas = ConsultaStock::where('estado', true)
            ->whereBetween('fecha', [$desde, $hasta])
            ->get();

        if ($consultas->isEmpty()) {
            return $this->kpiPendiente(
                'Tiempo Prom. Verificación de Stock (TPVS)',
                'TPVS = Σ minutos de conteos / N° de consultas de stock'
            );
        }

        $tpvs = round($consultas->sum('minutos') / $consultas->count(), 2);
        // Umbral de ejemplo (ajustar según meta real acordada con el negocio)
        $semaforo = $tpvs <= 5 ? 'verde' : ($tpvs <= 15 ? 'ambar' : 'rojo');

        return [
            'nombre'      => 'Tiempo Prom. Verificación de Stock (TPVS)',
            'formula'     => 'TPVS = Σ minutos de conteos / N° de consultas de stock',
            'valor_texto' => $tpvs . ' min',
            'semaforo'    => $semaforo,
        ];
    }

    /**
     * KPI 3 — Índice de Renovación de Mercancía
     * Renovación = Ventas acumuladas / Inventario promedio
     * Inventario promedio = (Inventario Inicial + Inventario Final) / 2
     *
     * El sistema no guarda una "foto" diaria del stock, así que el
     * inventario inicial/final del periodo se reconstruye a partir del
     * stock actual y los movimientos registrados en movimiento_inventario:
     * se le "resta" a la foto actual el efecto neto de los movimientos
     * ocurridos después de cada fecha de corte (Entrada = +cantidad,
     * Salida = -cantidad). Así se obtiene una aproximación razonable del
     * inventario tal como estaba al inicio y al final del periodo.
     */
    private function calcularRenovacion(Carbon $desde, Carbon $hasta): array
    {
        $ventasAcumuladas = (float) DB::table('detalle_venta as dv')
            ->join('venta as v', 'v.id_venta', '=', 'dv.id_venta')
            ->where('v.estado', 'Completada')
            ->whereBetween('v.fecha_venta', [$desde, $hasta])
            ->sum('dv.cantidad');

        $inventarioActual = (float) Producto::where('estado', true)->sum('stock_actual');

        // Efecto neto (signo) de los movimientos: Entrada suma, Salida resta.
        $signo = "CASE WHEN tipo_movimiento LIKE 'Entrada%' THEN cantidad
                       WHEN tipo_movimiento LIKE 'Salida%' THEN -cantidad
                       ELSE 0 END";

        $netoDespuesDeHasta = (float) DB::table('movimiento_inventario')
            ->where('fecha_movimiento', '>', $hasta)
            ->selectRaw("COALESCE(SUM($signo), 0) as neto")
            ->value('neto');

        $netoDesdeInicio = (float) DB::table('movimiento_inventario')
            ->where('fecha_movimiento', '>=', $desde)
            ->selectRaw("COALESCE(SUM($signo), 0) as neto")
            ->value('neto');

        // "Deshacemos" los movimientos posteriores a cada fecha de corte
        // para reconstruir el inventario tal como estaba en ese momento.
        $inventarioFinal   = $inventarioActual - $netoDespuesDeHasta;
        $inventarioInicial = $inventarioActual - $netoDesdeInicio;

        $inventarioPromedio = ($inventarioInicial + $inventarioFinal) / 2;

        $renovacion = $inventarioPromedio > 0
            ? round($ventasAcumuladas / $inventarioPromedio, 2)
            : 0;

        $semaforo = $renovacion >= 1 ? 'verde' : ($renovacion >= 0.5 ? 'ambar' : 'rojo');

        return [
            'nombre'      => 'Índice de Renovación de Mercancía',
            'formula'     => 'Renovación = Ventas acumuladas / Inventario promedio',
            'valor_texto' => (string) $renovacion,
            'semaforo'    => $semaforo,
        ];
    }

    /**
     * KPI 4 — Tasa de Pedidos Anulados por Error de Stock (TVCES)
     * TVCES = N° de ventas canceladas por falta de stock real / N° total de pedidos
     *
     * El sistema no guarda un motivo de anulación específico, por lo que
     * se usa como aproximación toda venta con estado "Anulada" dentro del
     * periodo. Si en el futuro se agrega un campo "motivo_anulacion",
     * este cálculo debe filtrar únicamente por el motivo de falta de stock.
     */
    private function calcularTvces(Carbon $desde, Carbon $hasta): array
    {
        $totalPedidos = Venta::whereBetween('fecha_venta', [$desde, $hasta])->count();
        $canceladas = Venta::where('estado', 'Anulada')
            ->whereBetween('fecha_venta', [$desde, $hasta])
            ->count();

        $tvces = $totalPedidos > 0 ? round(($canceladas / $totalPedidos) * 100, 2) : 0;
        $semaforo = $tvces <= 5 ? 'verde' : ($tvces <= 15 ? 'ambar' : 'rojo');

        return [
            'nombre'      => 'Tasa de Pedidos Anulados por Error de Stock (TVCES)',
            'formula'     => 'TVCES = Ventas canceladas por falta de stock real / Total de pedidos',
            'valor_texto' => $tvces . ' %',
            'semaforo'    => $semaforo,
        ];
    }

    private function kpiPendiente(string $nombre, string $formula): array
    {
        return [
            'nombre'      => $nombre,
            'formula'     => $formula,
            'valor_texto' => 'Pendiente de datos',
            'semaforo'    => 'pendiente',
        ];
    }
}
