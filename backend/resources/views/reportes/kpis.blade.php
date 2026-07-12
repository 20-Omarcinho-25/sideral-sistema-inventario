@extends('reportes._layout')

@section('titulo', 'Tablero de Indicadores de Gestión (KPIs)')

@section('contenido')
    <p style="font-size:11px; color:#555;">
        Periodo analizado: <strong>{{ $desde->format('d/m/Y') }}</strong> al <strong>{{ $hasta->format('d/m/Y') }}</strong>
    </p>

    @foreach($kpis as $kpi)
        <div class="kpi-card">
            <div class="kpi-nombre">{{ $kpi['nombre'] }}</div>
            <div class="kpi-formula">Fórmula: {{ $kpi['formula'] }}</div>
            <table style="margin-top:4px;">
                <tr>
                    <td style="width:30%;"><strong>Valor</strong></td>
                    <td style="width:40%;"><strong>Estado</strong></td>
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

    
@endsection
