import { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

interface Producto {
  id: number;
  codigo: string;
  marca: string;
  modelo: string;
  actual: number;
  ajuste: number;
}

const productosIniciales: Producto[] = [
  { id: 1, codigo: 'L001', marca: 'ASUS', modelo: 'ASUS Vivobook 15', actual: 15, ajuste: 0 },
  { id: 2, codigo: 'L002', marca: 'Apple', modelo: 'MacBook Air M2 13"', actual: 5, ajuste: 0 },
  { id: 3, codigo: 'L003', marca: 'HP', modelo: 'HP Pavilion Gaming 15', actual: 0, ajuste: 0 },
  { id: 4, codigo: 'L004', marca: 'Lenovo', modelo: 'Lenovo IdeaPad 3', actual: 25, ajuste: 0 },
  { id: 5, codigo: 'L005', marca: 'Dell', modelo: 'Dell XPS 13', actual: 8, ajuste: 0 },
  { id: 6, codigo: 'L006', marca: 'Acer', modelo: 'Acer Nitro 5', actual: 3, ajuste: 0 },
  { id: 7, codigo: 'L007', marca: 'MSI', modelo: 'MSI Katana GF66', actual: 12, ajuste: 0 },
  { id: 8, codigo: 'L008', marca: 'Huawei', modelo: 'Huawei MateBook D14', actual: 18, ajuste: 0 },
  { id: 9, codigo: 'L009', marca: 'Samsung', modelo: 'Samsung Galaxy Book3', actual: 2, ajuste: 0 },
  { id: 10, codigo: 'L010', marca: 'Microsoft', modelo: 'Microsoft Surface Laptop 5', actual: 0, ajuste: 0 },
];

export default function ActualizarStock() {
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>(productosIniciales);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredProductos(productos);
    } else {
      const filtered = productos.filter(
        (producto) =>
          producto.codigo.toLowerCase().includes(value.toLowerCase()) ||
          producto.marca.toLowerCase().includes(value.toLowerCase()) ||
          producto.modelo.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProductos(filtered);
    }
  };

  const handleActualChange = (id: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setProductos(productos.map(p => p.id === id ? { ...p, actual: numValue } : p));
    setFilteredProductos(filteredProductos.map(p => p.id === id ? { ...p, actual: numValue } : p));
  };

  const handleAjusteChange = (id: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setProductos(productos.map(p => p.id === id ? { ...p, ajuste: numValue } : p));
    setFilteredProductos(filteredProductos.map(p => p.id === id ? { ...p, ajuste: numValue } : p));
  };

  const handleCancelar = () => {
    setProductos(productosIniciales);
    setFilteredProductos(productosIniciales);
    toast.info('Cambios cancelados');
  };

  const handleGuardar = () => {
    const cambios = productos.filter(p => p.ajuste !== 0);
    if (cambios.length === 0) {
      toast.error('No hay cambios para guardar');
      return;
    }

    toast.success(`${cambios.length} producto(s) actualizados exitosamente`);
    // Aquí aplicarías los ajustes al stock actual
    const productosActualizados = productos.map(p => ({
      ...p,
      actual: p.actual + p.ajuste,
      ajuste: 0
    }));
    setProductos(productosActualizados);
    setFilteredProductos(productosActualizados);
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase">Actualizar Stock</h2>

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

      {/* Stock Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Código</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Marca</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Modelo</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Actual</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Ajuste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProductos.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-gray-700">{producto.codigo}</td>
                  <td className="px-3 py-2.5 text-gray-700">{producto.marca}</td>
                  <td className="px-3 py-2.5 text-gray-900">{producto.modelo}</td>
                  <td className="px-3 py-2.5 text-center">
                    <input
                      type="number"
                      value={producto.actual}
                      onChange={(e) => handleActualChange(producto.id, e.target.value)}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                    />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <input
                      type="number"
                      value={producto.ajuste}
                      onChange={(e) => handleAjusteChange(producto.id, e.target.value)}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={handleCancelar}
            className="px-6 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors uppercase"
          >
            Cancelar Cambios
          </button>
          <button
            onClick={handleGuardar}
            className="px-6 py-2 text-sm bg-[#1e6b3e] hover:bg-[#165530] text-white rounded transition-colors uppercase"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
