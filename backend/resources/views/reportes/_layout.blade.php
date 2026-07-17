{{-- Layout base: cabecera estandarizada para TODOS los reportes (Regla 3.1) --}}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body{ font-family: "DejaVu Sans", sans-serif; font-size:12px; color:#222; }
        .cab{ border-bottom:3px solid #1e6b3e; padding-bottom:8px; margin-bottom:14px;
              display:flex; align-items:center; justify-content:space-between; }
        .cab img{ height:52px; }
        .cab .tit{ text-align:right; }
        .cab .empresa{ font-size:16px; font-weight:bold; color:#1e6b3e; }
        .cab .subtitulo{ font-size:13px; font-weight:bold; margin-top:2px; }
        .cab .fecha{ font-size:10px; color:#555; }
        table{ width:100%; border-collapse:collapse; margin-top:8px; }
        th,td{ border:1px solid #ccc; padding:6px; font-size:11px; }
        th{ background:#1e6b3e; color:#fff; }
        .totales td{ font-weight:bold; background:#eef7f0; }
        .seccion-titulo{ font-size:13px; font-weight:bold; color:#1e6b3e; margin:16px 0 6px; }
        .kpi-card{ border:1px solid #ccc; border-radius:4px; padding:8px; margin-bottom:10px; }
        .kpi-nombre{ font-weight:bold; font-size:12px; }
        .kpi-formula{ font-size:10px; color:#666; margin:2px 0; }
        .kpi-valor{ font-size:16px; font-weight:bold; }
        .semaforo{ display:inline-block; padding:2px 8px; border-radius:10px; color:#fff; font-size:10px; }
        .semaforo-verde{ background:#1e6b3e; }
        .semaforo-ambar{ background:#c98a00; }
        .semaforo-rojo{ background:#b3261e; }
        .semaforo-pendiente{ background:#888; }
        .pie{ margin-top:20px; font-size:9px; color:#888; text-align:center; }
    </style>
</head>
<body>
    <div class="cab">
        @php $logoPath = public_path('logo_aiready.png'); @endphp
        @if(file_exists($logoPath))
            <img src="{{ asset('logo_aiready.png') }}">
        @else
            <div class="empresa">Sideral Carrión IT</div>
        @endif
        <div class="tit">
            @if(file_exists($logoPath))
                <div class="empresa">Sideral Carrión IT</div>
            @endif
            <div class="subtitulo">@yield('titulo')</div>
            <div class="fecha">Emitido: {{ now()->format('d/m/Y H:i:s') }}</div>
        </div>
    </div>

    @yield('contenido')

    {{-- Botón de impresión/PDF: se oculta automáticamente al imprimir --}}
    <div class="no-imprimir" style="margin-top:16px; text-align:center;">
        <button onclick="window.print()" style="background:#1e6b3e; color:#fff; border:none; padding:8px 20px; border-radius:6px; font-size:12px; cursor:pointer;">
            🖶 Imprimir / Guardar como PDF
        </button>
    </div>

    <div class="pie">Documento generado automáticamente por el Sistema de Gestión de Inventarios · Sideral Carrión IT</div>

    <style>
        @media print { .no-imprimir { display: none; } }
    </style>
</body>
</html>
