<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ingresos y Ventas Acumuladas</title>
    <style>
        body { font-family: "DejaVu Sans", sans-serif; font-size: 11px; color: #222; }
        .cabecera { text-align: center; margin-bottom: 20px; border-bottom: 3px solid #1e6b3e; padding-bottom: 10px; }
        .empresa { font-size: 18px; font-weight: bold; color: #1e6b3e; }
        .titulo { font-size: 14px; font-weight: bold; margin-top: 5px; }
        .fecha { font-size: 10px; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ccc; padding: 6px; font-size: 10px; }
        th { background: #1e6b3e; color: #fff; }
        .totales td { font-weight: bold; background: #eef7f0; }
        .seccion { font-size: 12px; font-weight: bold; color: #1e6b3e; margin: 15px 0 5px; }
        .pie { margin-top: 20px; font-size: 9px; color: #888; text-align: center; }
    </style>
</head>
<body>
    <div class="cabecera">
        <div class="empresa">Sideral Carrión IT</div>
        <div class="titulo">Reporte de Ingresos y Ventas Acumuladas</div>
        <div class="fecha">Generado el: {{ now()->format('d/m/Y H:i:s') }}</div>
    </div>

    <div class="seccion">Resumen de ingresos</div>
    <table>
        <thead>
            <tr>
                <th>Periodo evaluado</th>
                <th>Ventas completadas</th>
                <th>Total de ingresos</th>
            </tr>
        </thead>
        <tbody class="totales">
            <tr>
                <td style="text-align: center;">
                    @if($periodo['desde'] && $periodo['hasta'])
                        {{ $periodo['desde'] }} al {{ $periodo['hasta'] }}
                    @else
                        Todas las fechas disponibles
                    @endif
                </td>
                <td style="text-align: center;">{{ $numeroVentas }}</td>
                <td style="text-align: right;">S/ {{ number_format($totalIngresos, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="seccion">Ingresos agrupados por día</div>
    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Cantidad de ventas</th>
                <th>Ingresos del día</th>
            </tr>
        </thead>
        <tbody>
            @forelse($ingresosPorDia as $registro)
                <tr>
                    <td style="text-align: center;">{{ \Illuminate\Support\Carbon::parse($registro['fecha'])->format('d/m/Y') }}</td>
                    <td style="text-align: center;">{{ $registro['cantidad_ventas'] }}</td>
                    <td style="text-align: right;">S/ {{ number_format($registro['ingresos_dia'], 2) }}</td>
                </tr>
            @empty
                <tr><td colspan="3" style="text-align: center;">No existen ventas completadas para el periodo seleccionado.</td></tr>
            @endforelse
        </tbody>
        <tfoot>
            <tr>
                <th colspan="2" style="text-align: right;">Total de Ingresos</th>
                <th style="text-align: right;">S/ {{ number_format($totalIngresos, 2) }}</th>
            </tr>
        </tfoot>
    </table>

    <div class="seccion">Detalle de ventas completadas</div>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>DNI</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @forelse($ventas as $venta)
                <tr>
                    <td style="text-align: center;">{{ $venta->id_venta }}</td>
                    <td style="text-align: center;">{{ \Illuminate\Support\Carbon::parse($venta->fecha_venta)->format('d/m/Y H:i') }}</td>
                    <td>{{ $venta->nombre_cliente ?? 'Sin información' }}</td>
                    <td style="text-align: center;">{{ $venta->dni_cliente ?? '-' }}</td>
                    <td style="text-align: right;">S/ {{ number_format((float) $venta->total, 2) }}</td>
                </tr>
            @empty
                <tr><td colspan="5" style="text-align: center;">No existen ventas completadas.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="pie">Documento generado automáticamente por el Sistema de Gestión de Inventarios · Sideral Carrión IT</div>
</body>
</html>
