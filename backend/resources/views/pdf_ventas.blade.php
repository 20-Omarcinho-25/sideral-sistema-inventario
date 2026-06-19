<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ventas</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .cabecera { text-align: center; margin-bottom: 20px; }
        .titulo { font-size: 18px; font-weight: bold; color: #1e6b3e; }
        .fecha { font-size: 10px; color: #555; }
        table { w-full; border-collapse: collapse; margin-top: 10px; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; color: #333; }
        .total { text-align: right; font-weight: bold; }
    </style>
</head>
<body>
    <!-- Este es el "Decorator": La cabecera estandarizada -->
    <div class="cabecera">
        <div class="titulo">Sideral Carrión IT</div>
        <div>Reporte Histórico de Ventas</div>
        <div class="fecha">Generado el: {{ now()->format('d/m/Y H:i:s') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>ID Venta</th>
                <th>Cliente</th>
                <th>DNI/RUC</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th class="total">Total (S/)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($ventas as $venta)
            <tr>
                <td>VNT-{{ str_pad($venta->id_venta, 5, '0', STR_PAD_LEFT) }}</td>
                <td>{{ $venta->nombre_cliente }}</td>
                <td>{{ $venta->dni_cliente }}</td>
                <td>{{ $venta->fecha_venta }}</td>
                <td>{{ $venta->estado }}</td>
                <td class="total">{{ number_format($venta->total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>