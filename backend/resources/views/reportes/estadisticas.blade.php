@extends('reportes._layout')

@section('titulo', 'Reporte Estadístico de Ventas')

@section('contenido')
    {{-- Filtro de fechas: vive dentro de la propia página del reporte --}}
    <div class="no-imprimir" style="background:#f4f8f5; border:1px solid #d8e6dc; border-radius:6px; padding:12px; margin-bottom:14px; display:flex; align-items:end; gap:12px; flex-wrap:wrap;">
        <div>
            <label style="display:block; font-size:10px; color:#555; margin-bottom:3px;">Desde</label>
            <input type="date" id="f-desde" value="{{ $desde->format('Y-m-d') }}" style="padding:5px 8px; border:1px solid #ccc; border-radius:4px; font-size:12px;">
        </div>
        <div>
            <label style="display:block; font-size:10px; color:#555; margin-bottom:3px;">Hasta</label>
            <input type="date" id="f-hasta" value="{{ $hasta->format('Y-m-d') }}" style="padding:5px 8px; border:1px solid #ccc; border-radius:4px; font-size:12px;">
        </div>
        <button id="btn-actualizar" onclick="actualizarReporte()" style="background:#1e6b3e; color:#fff; border:none; padding:7px 18px; border-radius:5px; font-size:12px; cursor:pointer;">
            Actualizar
        </button>
        <span id="msg-estado" style="font-size:11px; color:#888;"></span>
    </div>

    <p style="font-size:11px; color:#555;">
        Periodo analizado: <strong>{{ $desde->format('d/m/Y') }}</strong> al <strong>{{ $hasta->format('d/m/Y') }}</strong>
        &nbsp;·&nbsp; Solo transacciones con estado <strong>Completada</strong>.
    </p>

    <table class="totales">
        <thead>
            <tr>
                <th>N° Transacciones</th>
                <th>Máximo (S/)</th>
                <th>Mínimo (S/)</th>
                <th>Promedio (S/)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $resumen['total_transacciones'] }}</td>
                <td>{{ number_format($resumen['maximo'], 2) }}</td>
                <td>{{ number_format($resumen['minimo'], 2) }}</td>
                <td>{{ number_format($resumen['promedio'], 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="seccion-titulo">Detalle de transacciones del periodo</div>
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
                <tr><td colspan="5" style="text-align:center;">No se registran ventas completadas en el periodo seleccionado.</td></tr>
            @endforelse
        </tbody>
    </table>

    <script>
        // Datos de sesión necesarios para que el botón "Actualizar" pueda
        // volver a pedir este mismo reporte con otras fechas, sin salir de la pestaña.
        const API_BASE = "{{ $apiBase }}";
        const TOKEN = "{{ $token }}";

        async function actualizarReporte() {
            const desde = document.getElementById('f-desde').value;
            const hasta = document.getElementById('f-hasta').value;
            const msg = document.getElementById('msg-estado');
            const boton = document.getElementById('btn-actualizar');

            if (!desde || !hasta) {
                msg.textContent = 'Selecciona ambas fechas.';
                msg.style.color = '#b3261e';
                return;
            }
            if (desde > hasta) {
                msg.textContent = 'La fecha "Desde" no puede ser posterior a "Hasta".';
                msg.style.color = '#b3261e';
                return;
            }

            boton.disabled = true;
            msg.style.color = '#555';
            msg.textContent = 'Actualizando...';

            try {
                const resp = await fetch(`${API_BASE}/reportes/estadisticas?desde=${desde}&hasta=${hasta}`, {
                    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'text/html' },
                });
                if (!resp.ok) {
                    msg.style.color = '#b3261e';
                    msg.textContent = 'No se pudo generar el reporte.';
                    boton.disabled = false;
                    return;
                }
                const html = await resp.text();
                document.open();
                document.write(html);
                document.close();
            } catch (e) {
                msg.style.color = '#b3261e';
                msg.textContent = 'Error de conexión.';
                boton.disabled = false;
            }
        }
    </script>
@endsection
