import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

interface Producto {
  id: number;
  codigo: string;
  marca: string;
  modelo: string;
  actual: number;
  ajuste: number;
  stock_actual: number; // Stock actual desde el backend para referencia en cálculos de ajuste
}


export default function ActualizarStock() {
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);


// 1. CARGA DINÁMICA
  const fetchProductos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/productos');
      const data = await response.json();
      const list = data.data ? data.data : data;
      
      // Agregamos la propiedad "ajuste" iniciada en 0 a la data real
      const productosFormateados = list.map((p: any) => ({
        ...p,
        ajuste: 0
      }));
      
      setProductos(productosFormateados);
      setFilteredProductos(productosFormateados);
    } catch (error) {
      toast.error('Error al cargar inventario');
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);


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
    setProductos([]);
    setFilteredProductos([]);
    toast.info('Cambios cancelados');
  };

 // 2. ACTUALIZACIÓN EN CALIENTE CON TRAZABILIDAD (PUT a Laravel)
  const handleGuardar = async () => {
    const cambios = productos.filter(p => p.ajuste !== 0);
    if (cambios.length === 0) {
      toast.error('No hay cambios de stock para guardar');
      return;
    }

    // Pedimos al usuario una justificación (Requisito clave de auditoría)
    const motivoAjuste = window.prompt("Por favor, ingrese el motivo del ajuste (Ej: 'Inventario físico', 'Merma por daño'):");
    
    if (!motivoAjuste || motivoAjuste.trim() === '') {
      toast.error('Operación cancelada: El motivo es obligatorio para auditoría');
      return;
    }

    try {
      // Usamos Promise.all para enviar múltiples transacciones atómicas al mismo tiempo
      await Promise.all(cambios.map(async (prod) => {
        const nuevoStock = prod.stock_actual + prod.ajuste!;
        
        // Armamos el Payload exacto que el Backend exige ahora
        const payload = {
          nuevo_stock: nuevoStock,
          ajuste: prod.ajuste,
          motivo: motivoAjuste
        };

        return fetch(`http://localhost:8000/api/productos/${prod.id}/stock`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json', 
            'Accept': 'application/json',
            // Ojo: Aquí deberías pasar el token Bearer si ya tienes implementado el Auth
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
          },
          body: JSON.stringify(payload)
        });
      }));

      toast.success(`${cambios.length} producto(s) actualizados y registrados en Auditoría`);
      fetchProductos(); // Volvemos a descargar el stock fresco
    } catch (error) {
      toast.error('Fallo de conexión al guardar los ajustes de stock');
    }
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
