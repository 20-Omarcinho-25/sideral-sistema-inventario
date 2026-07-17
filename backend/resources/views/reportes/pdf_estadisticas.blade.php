<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Estadístico de Ventas</title>
    <style>
        body { font-family: "DejaVu Sans", sans-serif; font-size: 11px; color: #222; }
        .cabecera { text-align: center; margin-bottom: 20px; border-bottom: 3px solid #1e6b3e; padding-bottom: 10px; }
        .empresa { font-size: 18px; font-weight: bold; color: #1e6b3e; }
        .titulo { font-size: 14px; font-weight: bold; margin-top: 5px; }
        .fecha { font-size: 10px; color: #555; }
        .periodo { font-size: 11px; color: #555; margin-bottom: 15px; }
        .periodo strong { color: #1e6b3e; }
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
        <div class="titulo">Reporte Estadístico de Ventas</div>
        <div class="fecha">Generado el: {{ now()->format('d/m/Y H:i:s') }}</div>
    </div>

    <p class="periodo">
        Periodo analizado: <strong>{{ $desde->format('d/m/Y') }}</strong> al <strong>{{ $hasta->format('d/m/Y') }}</strong>
        &nbsp;·&nbsp; Solo transacciones con estado <strong>Completada</strong>.
    </p>

    <table>
        <thead>
            <tr>
                <th>N° Transacciones</th>
                <th>Máximo (S/)</th>
                <th>Mínimo (S/)</th>
                <th>Promedio (S/)</th>
            </tr>
        </thead>
        <tbody class="totales">
            <tr>
                <td>{{ $resumen['total_transacciones'] }}</td>
                <td>{{ number_format($resumen['maximo'], 2) }}</td>
                <td>{{ number_format($resumen['minimo'], 2) }}</td>
                <td>{{ number_format($resumen['promedio'], 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="seccion">Detalle de transacciones del periodo</div>
    <table>
        <thead>
            <tr>
                <th>ID Venta</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>DNI/RUC</th>
                <th>Total (S/)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($ventas as $venta)
                <tr>
                    <td>VNT-{{ $venta->id_venta }}</td>
                    <td>{{ \Carbon\Carbon::parse($venta->fecha_venta)->format('d/m/Y H:i') }}</td>
                    <td>{{ $venta->nombre_cliente }}</td>
                    <td>{{ $venta->dni_cliente }}</td>
                    <td>{{ number_format($venta->total, 2) }}</td>
                </tr>
            @empty
                <tr><td colspan="5" style="text-align: center;">No se registran ventas completadas en el periodo seleccionado.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="pie">Documento generado automáticamente por el Sistema de Gestión de Inventarios · Sideral Carrión IT</div>
</body>
</html>
