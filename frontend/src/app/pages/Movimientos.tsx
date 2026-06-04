import { useState } from 'react';

interface Movimiento {
  id_movimiento: string;
  tipo_movimiento: string;
  fecha_movimiento: string;
  cantidad: number;
  id_producto: string;
  producto_nombre: string;
  id_usuario: string;
  usuario_nombre: string;
}

const movimientosEjemplo: Movimiento[] = [
  {
    id_movimiento: 'M001',
    tipo_movimiento: 'Entrada',
    fecha_movimiento: '2026-06-03 09:15:00',
    cantidad: 10,
    id_producto: 'L001',
    producto_nombre: 'ASUS Vivobook 15',
    id_usuario: 'U001',
    usuario_nombre: 'Juan Pérez',
  },
  {
    id_movimiento: 'M002',
    tipo_movimiento: 'Salida',
    fecha_movimiento: '2026-06-03 10:30:00',
    cantidad: 2,
    id_producto: 'L002',
    producto_nombre: 'MacBook Air M2 13"',
    id_usuario: 'U002',
    usuario_nombre: 'María García',
  },
  {
    id_movimiento: 'M003',
    tipo_movimiento: 'Entrada',
    fecha_movimiento: '2026-06-02 14:45:00',
    cantidad: 5,
    id_producto: 'L003',
    producto_nombre: 'HP Pavilion Gaming 15',
    id_usuario: 'U001',
    usuario_nombre: 'Juan Pérez',
  },
  {
    id_movimiento: 'M004',
    tipo_movimiento: 'Salida',
    fecha_movimiento: '2026-06-02 16:20:00',
    cantidad: 1,
    id_producto: 'L004',
    producto_nombre: 'Lenovo IdeaPad 3',
    id_usuario: 'U003',
    usuario_nombre: 'Carlos López',
  },
  {
    id_movimiento: 'M005',
    tipo_movimiento: 'Entrada',
    fecha_movimiento: '2026-06-01 11:00:00',
    cantidad: 8,
    id_producto: 'L005',
    producto_nombre: 'Dell XPS 13',
    id_usuario: 'U002',
    usuario_nombre: 'María García',
  },
  {
    id_movimiento: 'M006',
    tipo_movimiento: 'Salida',
    fecha_movimiento: '2026-06-01 15:30:00',
    cantidad: 3,
    id_producto: 'L006',
    producto_nombre: 'Acer Nitro 5',
    id_usuario: 'U001',
    usuario_nombre: 'Juan Pérez',
  },
  {
    id_movimiento: 'M007',
    tipo_movimiento: 'Entrada',
    fecha_movimiento: '2026-05-31 10:15:00',
    cantidad: 12,
    id_producto: 'L007',
    producto_nombre: 'MSI Katana GF66',
    id_usuario: 'U003',
    usuario_nombre: 'Carlos López',
  },
  {
    id_movimiento: 'M008',
    tipo_movimiento: 'Salida',
    fecha_movimiento: '2026-05-31 13:45:00',
    cantidad: 4,
    id_producto: 'L008',
    producto_nombre: 'Huawei MateBook D14',
    id_usuario: 'U002',
    usuario_nombre: 'María García',
  },
];

export default function Movimientos() {
  const [movimientos] = useState<Movimiento[]>(movimientosEjemplo);

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase">Movimientos de Inventario</h2>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">ID Movimiento</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Tipo</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Fecha y Hora</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Cantidad</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">ID Producto</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Producto</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">ID Usuario</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movimientos.map((movimiento) => (
                <tr key={movimiento.id_movimiento} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-gray-700">{movimiento.id_movimiento}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        movimiento.tipo_movimiento === 'Entrada'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {movimiento.tipo_movimiento}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-700">{movimiento.fecha_movimiento}</td>
                  <td className="px-3 py-2.5 text-center text-gray-900">{movimiento.cantidad}</td>
                  <td className="px-3 py-2.5 text-gray-700">{movimiento.id_producto}</td>
                  <td className="px-3 py-2.5 text-gray-900">{movimiento.producto_nombre}</td>
                  <td className="px-3 py-2.5 text-gray-700">{movimiento.id_usuario}</td>
                  <td className="px-3 py-2.5 text-gray-700">{movimiento.usuario_nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
