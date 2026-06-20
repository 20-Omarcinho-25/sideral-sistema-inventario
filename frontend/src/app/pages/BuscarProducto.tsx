import { useState, useEffect } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import { apiFetch } from '../lib/api';

// 1. Actualizamos la interfaz para que coincida exactamente con los campos de tu base de datos (Laravel)
interface Producto {
  id_producto: string;
  marca: string;
  nombre: string; // En tu BD le llamaste 'nombre', que equivale al modelo
  stock_actual: number;
  precio: number;
}

export default function BuscarProducto() {
  const [searchTerm, setSearchTerm] = useState('');
  // 2. Inicializamos el estado EN BLANCO (Obligatorio para la evaluación)
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  // 3. Función para consumir la API de Laravel "en caliente"
  const fetchProductos = async (busqueda = '') => {
    setCargando(true);
    try {
      // Llamamos a la API. Si hay búsqueda, Laravel la procesará con su método when()
      const url = busqueda
        ? `/productos?search=${encodeURIComponent(busqueda)}`
        : '/productos';

      const response = await apiFetch(url);
      const json = await response.json();
      
      // Si usaste ->paginate(10) en Laravel, extraemos json.data. Si usaste ->get(), es solo json
      const dataReal = json.data ? json.data : json;
      setProductos(dataReal);
    } catch (error) {
      console.error("Error al conectar con Laravel:", error);
    } finally {
      setCargando(false);
    }
  };

  // 4. Ejecutar la llamada automáticamente al entrar a la pantalla
  useEffect(() => {
    fetchProductos();
  }, []);

  // 5. Manejar la búsqueda en tiempo real
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchProductos(value); // Pide a la BD que filtre
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase">Buscar Producto</h2>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por Marca o Nombre/Modelo..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e]"
          />
        </div>
      </div>

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
              {cargando ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Cargando base de datos...</td></tr>
              ) : productos.length > 0 ? (
                productos.map((producto) => (
                  <tr key={producto.id_producto} className="hover:bg-gray-50">
                    {/* Imprimimos los datos que vienen exactamente del backend */}
                    <td className="px-3 py-2.5 text-gray-700">{producto.id_producto}</td>
                    <td className="px-3 py-2.5 text-gray-700">{producto.marca}</td>
                    <td className="px-3 py-2.5 text-gray-900">{producto.nombre}</td>
                    <td className="px-3 py-2.5 text-center text-gray-900">{producto.stock_actual}</td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded" title="Editar"><Edit size={16} className="text-gray-600" /></button>
                        <button className="p-1 hover:bg-gray-100 rounded" title="Eliminar"><Trash2 size={16} className="text-gray-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay productos registrados. Agrega uno nuevo.
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