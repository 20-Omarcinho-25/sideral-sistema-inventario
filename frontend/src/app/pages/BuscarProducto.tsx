import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';

interface Producto {
  id_producto: number;
  codigo_producto: string;
  marca: string;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  precio: number;
  id_proveedor: string;
}

interface ProveedorOption {
  id_proveedor: string;
  razon_social: string;
}

export default function BuscarProducto() {
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<ProveedorOption[]>([]);
  const [cargando, setCargando] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [editForm, setEditForm] = useState({
    marca: '',
    nombre: '',
    precio: '',
    stock_actual: '',
    stock_minimo: '',
    id_proveedor: '',
  });

  const fetchProductos = async (busqueda = '') => {
    setCargando(true);
    try {
      const url = busqueda
        ? `/productos?search=${encodeURIComponent(busqueda)}`
        : '/productos';

      const response = await apiFetch(url);
      const json = await response.json();
      const dataReal = json.productos ? json.productos : json;
      setProductos(dataReal);
    } catch {
      toast.error('Error al conectar con Laravel');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchProductos();
    apiFetch('/proveedores')
      .then(res => res.json())
      .then(data => setProveedores(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => toast.error('No se pudieron cargar proveedores'));
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchProductos(value);
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setEditForm({
      marca: producto.marca,
      nombre: producto.nombre,
      precio: String(producto.precio),
      stock_actual: String(producto.stock_actual),
      stock_minimo: String(producto.stock_minimo),
      id_proveedor: producto.id_proveedor,
    });
    setShowEditForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Desactivar este producto del inventario?')) return;

    try {
      const response = await apiFetch(`/productos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        toast.success('Producto desactivado');
        setProductos(prev => prev.filter(p => p.id_producto !== id));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message ?? 'Error al eliminar');
      }
    } catch {
      toast.error('Error de conexión');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProducto) return;

    try {
      const response = await apiFetch(`/productos/${editingProducto.id_producto}`, {
        method: 'PUT',
        body: JSON.stringify({
          marca: editForm.marca,
          nombre: editForm.nombre,
          precio: parseFloat(editForm.precio),
          stock_actual: parseInt(editForm.stock_actual, 10),
          stock_minimo: parseInt(editForm.stock_minimo, 10),
          id_proveedor: editForm.id_proveedor,
        }),
      });

      if (response.ok) {
        toast.success('Producto actualizado');
        setShowEditForm(false);
        setEditingProducto(null);
        fetchProductos(searchTerm);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message ?? 'Error al actualizar');
      }
    } catch {
      toast.error('Error de conexión');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase">Productos</h2>
        <Link
          to="/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1e6b3e] hover:bg-[#165530] text-white rounded transition-colors uppercase"
        >
          <Plus size={16} />
          Nuevo Producto
        </Link>
      </div>

      {showEditForm && editingProducto && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
            Editar Producto — {editingProducto.codigo_producto}
          </h3>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Marca</label>
                <input
                  type="text"
                  value={editForm.marca}
                  onChange={(e) => setEditForm({ ...editForm, marca: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Modelo</label>
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Precio (S/.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.precio}
                  onChange={(e) => setEditForm({ ...editForm, precio: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Stock actual</label>
                <input
                  type="number"
                  value={editForm.stock_actual}
                  onChange={(e) => setEditForm({ ...editForm, stock_actual: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Stock mínimo</label>
                <input
                  type="number"
                  value={editForm.stock_minimo}
                  onChange={(e) => setEditForm({ ...editForm, stock_minimo: e.target.value })}
                  required
                  min={10}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Proveedor</label>
                <select
                  value={editForm.id_proveedor}
                  onChange={(e) => setEditForm({ ...editForm, id_proveedor: e.target.value })}
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded"
                >
                  {proveedores.map((p) => (
                    <option key={p.id_proveedor} value={p.id_proveedor}>
                      {p.razon_social} ({p.id_proveedor})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingProducto(null);
                }}
                className="px-6 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded uppercase"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm bg-[#1e6b3e] hover:bg-[#165530] text-white rounded uppercase"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por código, marca o modelo..."
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
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Stock</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Precio</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cargando ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Cargando base de datos...</td>
                </tr>
              ) : productos.length > 0 ? (
                productos.map((producto) => (
                  <tr key={producto.id_producto} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 text-gray-700 font-medium">{producto.codigo_producto}</td>
                    <td className="px-3 py-2.5 text-gray-700">{producto.marca}</td>
                    <td className="px-3 py-2.5 text-gray-900">{producto.nombre}</td>
                    <td className="px-3 py-2.5 text-center text-gray-900">{producto.stock_actual}</td>
                    <td className="px-3 py-2.5 text-right text-gray-900">S/ {Number(producto.precio).toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(producto)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Editar"
                        >
                          <Edit size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id_producto)}
                          className="p-1 hover:bg-red-50 rounded"
                          title="Eliminar"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
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
