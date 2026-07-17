@extends('reportes._layout')

@section('titulo', 'Reporte de Registros Eliminados')

@section('contenido')
   

    <table class="totales">
        <thead>
            <tr>
                <th>Productos desactivados</th>
                <th>Usuarios desactivados</th>
                <th>Proveedores desactivados</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $productos->count() }}</td>
                <td>{{ $usuarios->count() }}</td>
                <td>{{ $proveedores->count() }}</td>
            </tr>
        </tbody>
    </table>

    <div class="seccion-titulo">Productos desactivados</div>
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
                <tr><td colspan="6" style="text-align:center;">Sin productos desactivados.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="seccion-titulo">Usuarios desactivados</div>
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
                <tr><td colspan="5" style="text-align:center;">Sin usuarios desactivados.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div class="seccion-titulo">Proveedores desactivados</div>
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
                <tr><td colspan="5" style="text-align:center;">Sin proveedores desactivados.</td></tr>
            @endforelse
        </tbody>
    </table>
@endsection
