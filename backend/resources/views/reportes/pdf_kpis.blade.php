<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Tablero de Indicadores de Gestión (KPIs)</title>
    <style>
        body { font-family: "DejaVu Sans", sans-serif; font-size: 11px; color: #222; }
        .cabecera { text-align: center; margin-bottom: 20px; border-bottom: 3px solid #1e6b3e; padding-bottom: 10px; }
        .empresa { font-size: 18px; font-weight: bold; color: #1e6b3e; }
        .titulo { font-size: 14px; font-weight: bold; margin-top: 5px; }
        .fecha { font-size: 10px; color: #555; }
        .periodo { font-size: 11px; color: #555; margin-bottom: 15px; }
        .periodo strong { color: #1e6b3e; }
        .kpi-card { border: 1px solid #ccc; border-radius: 4px; padding: 10px; margin-bottom: 12px; }
        .kpi-nombre { font-weight: bold; font-size: 12px; color: #1e6b3e; }
        .kpi-formula { font-size: 9px; color: #666; margin: 4px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        td { padding: 4px; font-size: 10px; }
        .kpi-valor { font-size: 18px; font-weight: bold; }
        .semaforo { display: inline-block; padding: 3px 10px; border-radius: 12px; color: #fff; font-size: 10px; font-weight: bold; }
        .semaforo-verde { background: #1e6b3e; }
        .semaforo-ambar { background: #c98a00; }
        .semaforo-rojo { background: #b3261e; }
        .semaforo-pendiente { background: #888; }
        .pie { margin-top: 20px; font-size: 9px; color: #888; text-align: center; }
    </style>
</head>
<body>
    <div class="cabecera">
        <div class="empresa">Sideral Carrión IT</div>
        <div class="titulo">Tablero de Indicadores de Gestión (KPIs)</div>
        <div class="fecha">Generado el: {{ now()->format('d/m/Y H:i:s') }}</div>
    </div>

    <p class="periodo">
        Periodo analizado: <strong>{{ $desde->format('d/m/Y') }}</strong> al <strong>{{ $hasta->format('d/m/Y') }}</strong>
    </p>

    @foreach($kpis as $kpi)
        <div class="kpi-card">
            <div class="kpi-nombre">{{ $kpi['nombre'] }}</div>
            <div class="kpi-formula">Fórmula: {{ $kpi['formula'] }}</div>
            <table>
                <tr>
                    <td style="width: 30%;"><strong>Valor</strong></td>
                    <td style="width: 40%;"><strong>Estado</strong></td>
                </tr>
                <tr>
                    <td class="kpi-valor">{{ $kpi['valor_texto'] }}</td>
                    <td>
                        <span class="semaforo semaforo-{{ $kpi['semaforo'] }}">
                            {{ strtoupper($kpi['semaforo']) }}
                        </span>
                    </td>
                </tr>
            </table>
        </div>
    @endforeach

    <div class="pie">Documento generado automáticamente por el Sistema de Gestión de Inventarios · Sideral Carrión IT</div>
</body>
</html>
