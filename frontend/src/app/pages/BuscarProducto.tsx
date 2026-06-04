import { useState } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';

interface Producto {
  id: number;
  codigo: string;
  marca: string;
  modelo: string;
  stockActual: number;
  precio: number;
}

const productosEjemplo: Producto[] = [
  { id: 1, codigo: 'L001', marca: 'ASUS', modelo: 'ASUS Vivobook 15', stockActual: 15, precio: 2499 },
  { id: 2, codigo: 'L002', marca: 'Apple', modelo: 'MacBook Air M2 13"', stockActual: 5, precio: 4800 },
  { id: 3, codigo: 'L003', marca: 'HP', modelo: 'HP Pavilion Gaming 15', stockActual: 0, precio: 3200 },
  { id: 4, codigo: 'L004', marca: 'Lenovo', modelo: 'Lenovo IdeaPad 3', stockActual: 25, precio: 1850 },
  { id: 5, codigo: 'L005', marca: 'Dell', modelo: 'Dell XPS 13', stockActual: 8, precio: 5100 },
  { id: 6, codigo: 'L006', marca: 'Acer', modelo: 'Acer Nitro 5', stockActual: 3, precio: 3550 },
  { id: 7, codigo: 'L007', marca: 'MSI', modelo: 'MSI Katana GF66', stockActual: 12, precio: 4100 },
  { id: 8, codigo: 'L008', marca: 'Huawei', modelo: 'Huawei MateBook D14', stockActual: 18, precio: 2200 },
  { id: 9, codigo: 'L009', marca: 'Samsung', modelo: 'Samsung Galaxy Book3', stockActual: 2, precio: 3900 },
  { id: 10, codigo: 'L010', marca: 'Microsoft', modelo: 'Microsoft Surface Laptop 5', stockActual: 0, precio: 4500 },
];

export default function BuscarProducto() {
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState<Producto[]>(productosEjemplo);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>(productosEjemplo);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredProductos(productos);
    } else {
      const filtered = productos.filter(
        (producto) =>
          producto.marca.toLowerCase().includes(value.toLowerCase()) ||
          producto.modelo.toLowerCase().includes(value.toLowerCase()) ||
          producto.codigo.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProductos(filtered);
    }
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase">Buscar Producto</h2>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por Código, Marca, Modelo..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Código</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Marca</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Modelo</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Stock Actual</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProductos.length > 0 ? (
                filteredProductos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 text-gray-700">{producto.codigo}</td>
                    <td className="px-3 py-2.5 text-gray-700">{producto.marca}</td>
                    <td className="px-3 py-2.5 text-gray-900">{producto.modelo}</td>
                    <td className="px-3 py-2.5 text-center text-gray-900">{producto.stockActual}</td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Editar">
                          <Edit size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Eliminar">
                          <Trash2 size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
