<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Registros Eliminados</title>
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
        <div class="titulo">Reporte de Registros Eliminados</div>
        <div class="fecha">Generado el: {{ now()->format('d/m/Y H:i:s') }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Productos desactivados</th>
                <th>Usuarios desactivados</th>
                <th>Proveedores desactivados</th>
            </tr>
        </thead>
        <tbody class="totales">
            <tr>
                <td>{{ $productos->count() }}</td>
                <td>{{ $usuarios->count() }}</td>
                <td>{{ $proveedores->count() }}</td>
            </tr>
        </tbody>
    </table>

    <div class="seccion">Productos desactivados</div>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>N° Serie</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Precio (S/)</th>
                <th>Stock actual</th>
            </tr>
        </thead>
        <tbody>
            @forelse($productos as $p)
                <tr>
                    <td>{{ $p->id_producto }}</td>
                    <td>{{ $p->num_serie }}</td>
                    <td>{{ $p->nombre }}</td>
                    <td>{{ $p->marca }}</td>
                    <td>{{ number_format($p->precio, 2) }}</td>
                    <td>{{ $p->stock_actual }}</td>
                </tr>
            @empty
                <tr><td colspan="6" style="text-align: center;">Sin productos desactivados.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="seccion">Usuarios desactivados</div>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Usuario</th>
                <th>Correo</th>
            </tr>
        </thead>
        <tbody>
            @forelse($usuarios as $u)
                <tr>
                    <td>{{ $u->id_usuario }}</td>
                    <td>{{ $u->nombre }}</td>
                    <td>{{ $u->apellido }}</td>
                    <td>{{ $u->username }}</td>
                    <td>{{ $u->correo }}</td>
                </tr>
            @empty
                <tr><td colspan="5" style="text-align: center;">Sin usuarios desactivados.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="seccion">Proveedores desactivados</div>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Razón social</th>
                <th>RUC</th>
                <th>Teléfono</th>
                <th>Correo</th>
            </tr>
        </thead>
        <tbody>
            @forelse($proveedores as $prov)
                <tr>
                    <td>{{ $prov->id_proveedor }}</td>
                    <td>{{ $prov->razon_social }}</td>
                    <td>{{ $prov->ruc }}</td>
                    <td>{{ $prov->telefono }}</td>
                    <td>{{ $prov->correo }}</td>
                </tr>
            @empty
                <tr><td colspan="5" style="text-align: center;">Sin proveedores desactivados.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="pie">Documento generado automáticamente por el Sistema de Gestión de Inventarios · Sideral Carrión IT</div>
</body>
</html>
