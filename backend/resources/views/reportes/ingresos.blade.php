@extends('reportes._layout')

@section('titulo', 'Reporte 4 — Ingresos y Ventas Acumuladas')

@section('contenido')

    <h2>Resumen de ingresos</h2>

    <table>
        <thead>
            <tr>
                <th>Periodo evaluado</th>
                <th>Ventas completadas</th>
                <th>Total de ingresos</th>
            </tr>
        </thead>

        <tbody>
            <tr>
                <td style="text-align: center;">
                    @if($periodo['desde'] && $periodo['hasta'])
                        {{ $periodo['desde'] }} al {{ $periodo['hasta'] }}
                    @else
                        Todas las fechas disponibles
                    @endif
                </td>

                <td style="text-align: center;">
                    {{ $numeroVentas }}
                </td>

                <td style="text-align: right;">
                    S/ {{ number_format($totalIngresos, 2) }}
                </td>
            </tr>
        </tbody>
    </table>

    <h2>Ingresos agrupados por día</h2>

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
                    <td style="text-align: center;">
                        {{
                            \Illuminate\Support\Carbon::parse(
                                $registro['fecha']
                            )->format('d/m/Y')
                        }}
                    </td>

                    <td style="text-align: center;">
                        {{ $registro['cantidad_ventas'] }}
                    </td>

                    <td style="text-align: right;">
                        S/
                        {{
                            number_format(
                                $registro['ingresos_dia'],
                                2
                            )
                        }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="3" style="text-align: center;">
                        No existen ventas completadas para el periodo seleccionado.
                    </td>
                </tr>
            @endforelse
        </tbody>

        <tfoot>
            <tr>
                <th colspan="2">
                    Total de Ingresos
                </th>

                <th style="text-align: right;">
                    S/ {{ number_format($totalIngresos, 2) }}
                </th>
            </tr>
        </tfoot>
    </table>

    <h2>Detalle de ventas completadas</h2>

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
                    <td style="text-align: center;">
                        {{ $venta->id_venta }}
                    </td>

                    <td style="text-align: center;">
                        {{
                            \Illuminate\Support\Carbon::parse(
                                $venta->fecha_venta
                            )->format('d/m/Y H:i')
                        }}
                    </td>

                    <td>
                        {{ $venta->nombre_cliente ?? 'Sin información' }}
                    </td>

                    <td style="text-align: center;">
                        {{ $venta->dni_cliente ?? '-' }}
                    </td>

                    <td style="text-align: right;">
                        S/ {{ number_format((float) $venta->total, 2) }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center;">
                        No existen ventas completadas.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

@endsection