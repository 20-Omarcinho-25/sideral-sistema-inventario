import { Download, FileText } from 'lucide-react';
import logoAIReady from '../../imports/Logo_AIReady.png';

interface ProductoInventario {
  id: string;
  producto: string;
  categoria: string;
  precioUnitario: number;
  stock: number;
  estado: 'Disponible' | 'Stock Bajo' | 'Agotado';
}

const inventario: ProductoInventario[] = [
  { id: 'L001', producto: 'Laptop ASUS Vivobook 15', categoria: 'Estándar', precioUnitario: 2499, stock: 15, estado: 'Disponible' },
  { id: 'L002', producto: 'MacBook Air M2 13"', categoria: 'Premium', precioUnitario: 4800, stock: 5, estado: 'Stock Bajo' },
  { id: 'L003', producto: 'HP Pavilion Gaming 15', categoria: 'Gaming', precioUnitario: 3200, stock: 0, estado: 'Agotado' },
  { id: 'L004', producto: 'Lenovo IdeaPad 3', categoria: 'Estándar', precioUnitario: 1850, stock: 25, estado: 'Disponible' },
  { id: 'L005', producto: 'Dell XPS 13', categoria: 'Ultrabook', precioUnitario: 5100, stock: 8, estado: 'Disponible' },
  { id: 'L006', producto: 'Acer Nitro 5', categoria: 'Gaming', precioUnitario: 3550, stock: 3, estado: 'Stock Bajo' },
  { id: 'L007', producto: 'MSI Katana GF66', categoria: 'Gaming', precioUnitario: 4100, stock: 12, estado: 'Disponible' },
  { id: 'L008', producto: 'Laptop Huawei MateBook D14', categoria: 'Oficina', precioUnitario: 2200, stock: 18, estado: 'Disponible' },
  { id: 'L009', producto: 'Samsung Galaxy Book3', categoria: 'Ultrabook', precioUnitario: 3900, stock: 2, estado: 'Stock Bajo' },
  { id: 'L010', producto: 'Microsoft Surface Laptop 5', categoria: 'Premium', precioUnitario: 4500, stock: 0, estado: 'Agotado' },
];

export default function Reporte() {
  const today = new Date();
  const fechaEmision = today.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

  const exportarPDF = () => {
    window.print();
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Stock Bajo':
        return 'bg-yellow-100 text-yellow-800';
      case 'Agotado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl text-gray-800">Reporte de Inventario</h1>
        <button
          onClick={exportarPDF}
          className="px-6 py-2.5 bg-[#1e6b3e] hover:bg-[#165530] text-white rounded-md transition-colors flex items-center gap-2"
        >
          <Download size={18} />
          Generar PDF
        </button>
      </div>

      {/* Reporte */}
      <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none print:rounded-none">
        {/* Header del reporte */}
        <div className="mb-6 text-center">
          <img src={logoAIReady} alt="AIReady Logo" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#2c5f4f] mb-2">ALREADY - REPORTE DE INVENTARIO</h1>
          <p className="text-gray-600">Sideral Carrión IT | Gestión de Laptops</p>
          <div className="h-1 bg-gray-300 mt-4 mb-6"></div>
        </div>

        {/* Información del reporte */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Fecha de emisión:</span> {fechaEmision} |
            <span className="font-semibold"> Generado por:</span> Sistema AIReady |
            <span className="font-semibold"> Almacén:</span> Central Wilson
          </p>
        </div>

        {/* Tabla de inventario */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#3d4d5c] text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">PRODUCTO</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">CATEGORÍA</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">PRECIO UNIT.</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">STOCK</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">ESTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventario.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.producto}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.categoria}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">S/ {item.precioUnitario.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{item.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getEstadoColor(item.estado)}`}>
                      {item.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Este documento es un reporte oficial generado por el sistema de gestión AIReady.
          </p>
        </div>
      </div>
    </div>
  );
}
