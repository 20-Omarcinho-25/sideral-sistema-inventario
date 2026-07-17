<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">

    <title>
        Reporte 5 - Cumplimiento de Metas Trimestrales
    </title>

    <style>
        @page {
            margin: 28px 32px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #263238;
            margin: 0;
        }

        .encabezado {
            width: 100%;
            border-bottom: 3px solid #1e6b3e;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }

        .encabezado-tabla {
            width: 100%;
            border-collapse: collapse;
        }

        .logo-contenedor {
            width: 30%;
            vertical-align: middle;
        }

        .logo {
            max-width: 145px;
            max-height: 65px;
        }

        .marca-alternativa {
            font-size: 24px;
            font-weight: bold;
            color: #1e6b3e;
        }

        .titulo-contenedor {
            width: 70%;
            text-align: right;
            vertical-align: middle;
        }

        .titulo {
            margin: 0;
            font-size: 19px;
            color: #1e6b3e;
        }

        .subtitulo {
            margin-top: 5px;
            font-size: 11px;
            color: #607d8b;
        }

        .informacion {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .informacion td {
            padding: 7px 9px;
            border: 1px solid #dfe5e8;
        }

        .etiqueta {
            width: 24%;
            background-color: #f1f6f3;
            font-weight: bold;
            color: #1e6b3e;
        }

        .seccion-titulo {
            margin-top: 14px;
            margin-bottom: 9px;
            padding-bottom: 5px;
            border-bottom: 1px solid #b0bec5;
            font-size: 14px;
            color: #37474f;
        }

        .resumen {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px;
            margin-left: -8px;
        }

        .tarjeta {
            width: 25%;
            border: 1px solid #dfe5e8;
            padding: 13px 8px;
            text-align: center;
            border-radius: 5px;
        }

        .tarjeta-titulo {
            font-size: 10px;
            color: #607d8b;
            margin-bottom: 7px;
            text-transform: uppercase;
        }

        .tarjeta-valor {
            font-size: 17px;
            font-weight: bold;
            color: #263238;
        }

        .avance {
            margin-top: 18px;
            padding: 14px;
            border: 1px solid #dfe5e8;
            background-color: #fafafa;
        }

        .barra-fondo {
            width: 100%;
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin-top: 8px;
        }

        .barra-avance {
            height: 20px;
            background-color: #1e6b3e;
            text-align: center;
            color: white;
            line-height: 20px;
            font-weight: bold;
        }

        .estado {
            margin-top: 16px;
            padding: 13px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            border-radius: 4px;
        }

        .cumplido {
            color: #1b5e20;
            background-color: #e8f5e9;
            border: 1px solid #81c784;
        }

        .riesgo {
            color: #b71c1c;
            background-color: #ffebee;
            border: 1px solid #ef9a9a;
        }

        .observacion {
            margin-top: 18px;
            padding: 11px;
            background-color: #fff8e1;
            border-left: 4px solid #f9a825;
            line-height: 1.5;
        }

        .pie {
            position: fixed;
            bottom: -12px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #78909c;
            border-top: 1px solid #cfd8dc;
            padding-top: 6px;
        }
    </style>
</head>

<body>

@php
    $posiblesLogos = [
        public_path('logo_aiready.png'),
        public_path('Logo_AIReady.png'),
        public_path('images/logo_aiready.png'),
        public_path('images/Logo_AIReady.png'),
    ];

    $logoEncontrado = null;

    foreach ($posiblesLogos as $posibleLogo) {
        if (file_exists($posibleLogo)) {
            $logoEncontrado = $posibleLogo;
            break;
        }
    }

    $porcentajeBarra = min($avance, 100);
@endphp

<div class="encabezado">
    <table class="encabezado-tabla">
        <tr>
            <td class="logo-contenedor">
                @if ($logoEncontrado)
                    <img
                        src="{{ $logoEncontrado }}"
                        alt="Logo AIReady"
                        class="logo"
                    >
                @else
                    <div class="marca-alternativa">
                        AIReady
                    </div>
                @endif
            </td>

            <td class="titulo-contenedor">
                <h1 class="titulo">
                    Reporte 5 — Cumplimiento de Metas Trimestrales
                </h1>

                <div class="subtitulo">
                    Sistema de Inventario Sideral
                </div>
            </td>
        </tr>
    </table>
</div>

<table class="informacion">
    <tr>
        <td class="etiqueta">
            Descripción
        </td>

        <td>
            {{ $meta->descripcion }}
        </td>
    </tr>

    <tr>
        <td class="etiqueta">
            Periodo evaluado
        </td>

        <td>
            Trimestre {{ $trimestre }} del año {{ $anio }}
        </td>
    </tr>

    <tr>
        <td class="etiqueta">
            Fecha inicial
        </td>

        <td>
            {{ $desde->format('d/m/Y') }}
        </td>
    </tr>

    <tr>
        <td class="etiqueta">
            Fecha final
        </td>

        <td>
            {{ $hasta->format('d/m/Y') }}
        </td>
    </tr>

    <tr>
        <td class="etiqueta">
            Fecha de emisión
        </td>

        <td>
            {{ now()->format('d/m/Y H:i:s') }}
        </td>
    </tr>
</table>

<h2 class="seccion-titulo">
    Resumen del cumplimiento
</h2>

<table class="resumen">
    <tr>
        <td class="tarjeta">
            <div class="tarjeta-titulo">
                Meta planificada
            </div>

            <div class="tarjeta-valor">
                S/ {{ number_format($metaPlanificada, 2) }}
            </div>
        </td>

        <td class="tarjeta">
            <div class="tarjeta-titulo">
                Total logrado
            </div>

            <div class="tarjeta-valor">
                S/ {{ number_format($logrado, 2) }}
            </div>
        </td>

        <td class="tarjeta">
            <div class="tarjeta-titulo">
                Cantidad de ventas
            </div>

            <div class="tarjeta-valor">
                {{ $cantidadVentas }}
            </div>
        </td>

        <td class="tarjeta">
            <div class="tarjeta-titulo">
                Diferencia
            </div>

            <div class="tarjeta-valor">
                S/ {{ number_format($diferencia, 2) }}
            </div>
        </td>
    </tr>
</table>

<div class="avance">
    <strong>
        Porcentaje de avance:
        {{ number_format($avance, 1) }}%
    </strong>

    <div class="barra-fondo">
        <div
            class="barra-avance"
            style="width: {{ $porcentajeBarra }}%;"
        >
            {{ number_format($avance, 1) }}%
        </div>
    </div>
</div>

<div class="estado {{ $estadoCumplimiento === 'Cumplido' ? 'cumplido' : 'riesgo' }}">
    Estado: {{ $estadoCumplimiento }}
</div>

<div class="observacion">
    <strong>Criterio aplicado:</strong>

    El porcentaje de cumplimiento se obtiene dividiendo el total
    vendido entre la meta planificada y multiplicándolo por 100.

    Solo se consideran ventas con estado
    <strong>Completada</strong>.
</div>

<div class="pie">
    Reporte generado automáticamente por el Sistema de Inventario Sideral.
</div>

</body>
</html>