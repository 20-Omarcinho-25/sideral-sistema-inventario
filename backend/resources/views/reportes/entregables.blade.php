<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">

    <title>
        Reporte 6 - Entregables Aceptados
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
            margin-bottom: 18px;
        }

        .informacion td {
            padding: 7px 9px;
            border: 1px solid #dfe5e8;
        }

        .etiqueta {
            width: 30%;
            background-color: #f1f6f3;
            font-weight: bold;
            color: #1e6b3e;
        }

        .resumen {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px;
            margin-left: -8px;
            margin-bottom: 18px;
        }

        .tarjeta {
            width: 33.33%;
            border: 1px solid #dfe5e8;
            padding: 14px 8px;
            text-align: center;
        }

        .tarjeta-titulo {
            font-size: 10px;
            color: #607d8b;
            margin-bottom: 7px;
            text-transform: uppercase;
        }

        .tarjeta-valor {
            font-size: 18px;
            font-weight: bold;
            color: #263238;
        }

        .avance {
            margin-bottom: 20px;
            padding: 14px;
            border: 1px solid #dfe5e8;
            background-color: #fafafa;
        }

        .barra-fondo {
            width: 100%;
            height: 20px;
            background-color: #e0e0e0;
            margin-top: 8px;
        }

        .barra-avance {
            height: 20px;
            background-color: #1e6b3e;
            color: #ffffff;
            text-align: center;
            line-height: 20px;
            font-weight: bold;
        }

        .seccion-titulo {
            margin-top: 14px;
            margin-bottom: 9px;
            padding-bottom: 5px;
            border-bottom: 1px solid #b0bec5;
            font-size: 14px;
            color: #37474f;
        }

        .tabla-detalle {
            width: 100%;
            border-collapse: collapse;
        }

        .tabla-detalle th {
            background-color: #1e6b3e;
            color: white;
            padding: 8px;
            border: 1px solid #155430;
            text-align: left;
        }

        .tabla-detalle td {
            padding: 8px;
            border: 1px solid #dfe5e8;
        }

        .tabla-detalle tr:nth-child(even) {
            background-color: #f8faf9;
        }

        .aceptado {
            color: #1b5e20;
            font-weight: bold;
        }

        .sin-registros {
            padding: 14px;
            text-align: center;
            background-color: #fff8e1;
            border: 1px solid #ffe082;
        }

        .observacion {
            margin-top: 18px;
            padding: 11px;
            background-color: #e8f5e9;
            border-left: 4px solid #1e6b3e;
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
                    Reporte 6 — Entregables Aceptados
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
            Fecha de emisión
        </td>

        <td>
            {{ now()->format('d/m/Y H:i:s') }}
        </td>
    </tr>

    <tr>
        <td class="etiqueta">
            Criterio de evaluación
        </td>

        <td>
            Entregables activos con indicador de aceptación confirmado.
        </td>
    </tr>
</table>

<table class="resumen">
    <tr>
        <td class="tarjeta">
            <div class="tarjeta-titulo">
                Total de entregables activos
            </div>

            <div class="tarjeta-valor">
                {{ $total }}
            </div>
        </td>

        <td class="tarjeta">
            <div class="tarjeta-titulo">
                Entregables aceptados
            </div>

            <div class="tarjeta-valor">
                {{ $cantidadAceptados }}
            </div>
        </td>

        <td class="tarjeta">
            <div class="tarjeta-titulo">
                Avance físico
            </div>

            <div class="tarjeta-valor">
                {{ number_format($avance, 1) }}%
            </div>
        </td>
    </tr>
</table>

<div class="avance">
    <strong>
        Avance físico del proyecto:
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

<h2 class="seccion-titulo">
    Detalle de entregables aceptados
</h2>

@if ($aceptados->count() > 0)
    <table class="tabla-detalle">
        <thead>
            <tr>
                <th style="width: 8%;">
                    N.º
                </th>

                <th style="width: 42%;">
                    Nombre
                </th>

                <th style="width: 22%;">
                    Fase
                </th>

                <th style="width: 28%;">
                    Fecha de aceptación
                </th>
            </tr>
        </thead>

        <tbody>
            @foreach ($aceptados as $indice => $entregable)
                <tr>
                    <td>
                        {{ $indice + 1 }}
                    </td>

                    <td>
                        {{ $entregable->nombre }}
                    </td>

                    <td>
                        {{ $entregable->fase }}
                    </td>

                    <td class="aceptado">
                        {{ $entregable->fecha_aceptacion
                            ? $entregable->fecha_aceptacion->format('d/m/Y H:i')
                            : 'Sin fecha registrada'
                        }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@else
    <div class="sin-registros">
        No existen entregables aceptados y activos.
    </div>
@endif

<div class="observacion">
    <strong>Fórmula aplicada:</strong>

    Avance físico =
    entregables aceptados /
    total de entregables activos × 100.

    Los registros desactivados mediante
    <strong>estado = 0</strong>
    no se consideran.
</div>

<div class="pie">
    Reporte generado automáticamente por el Sistema de Inventario Sideral.
</div>

</body>
</html>