import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { productoSchema, type ProductoFormData } from '../lib/validations';

interface ProveedorOption {
  id_proveedor: string;
  razon_social: string;
}

export default function NuevoProducto() {
  const [formData, setFormData] = useState({
    codigoUnico: 'L001',
    marca: '',
    modelo: '',
    numeroSerie: '',
    stockInicial: '',
    costoUnitario: '',
    precioVenta: '',
    proveedor: '',
    ubicacion: '',
  });

  const [proveedores, setProveedores] = useState<ProveedorOption[]>([]);

  useEffect(() => {
    apiFetch('/productos/siguiente-codigo')
      .then(res => res.json())
      .then(data => {
        if (data.codigo) {
          setFormData(prev => ({ ...prev, codigoUnico: data.codigo }));
        }
      })
      .catch(() => toast.error('No se pudo calcular el siguiente código'));

    apiFetch('/proveedores')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.data ?? [];
        setProveedores(list);
      })
      .catch(() => toast.error('No se pudieron cargar los proveedores'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación con Zod
    const validationResult = productoSchema.safeParse({
      num_serie: formData.numeroSerie.toUpperCase(),
      nombre: formData.modelo,
      marca: formData.marca,
      precio: formData.precioVenta,
      stock_actual: formData.stockInicial,
      stock_minimo: '10', // Valor fijo según el código original
      id_proveedor: formData.proveedor,
      ubicacion: formData.ubicacion || 'AL01',
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const firstError = errors[0];
      toast.error(firstError.message);
      return;
    }

    const payload = {
      num_serie: formData.numeroSerie.toUpperCase(),
      nombre: formData.modelo,
      marca: formData.marca,
      precio: parseFloat(formData.precioVenta),
      stock_actual: parseInt(formData.stockInicial, 10),
      stock_minimo: 10,
      id_proveedor: formData.proveedor,
      ubicacion: formData.ubicacion || 'AL01',
    };

    try {
      const response = await apiFetch('/productos', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Producto creado correctamente');
        const nextRes = await apiFetch('/productos/siguiente-codigo');
        const nextData = await nextRes.json();
        setFormData({
          codigoUnico: nextData.codigo ?? 'L001',
          marca: '',
          modelo: '',
          numeroSerie: '',
          stockInicial: '',
          costoUnitario: '',
          precioVenta: '',
          proveedor: '',
          ubicacion: '',
        });
      } else {
        const errorData = await response.json();
        console.log('Errores de validación:', errorData);
        toast.error(errorData.message ?? 'Error al crear el producto');
      }
    } catch {
      toast.error('Error de conexión con el servidor');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Transformar numeroSerie a mayúsculas automáticamente
    if (name === 'numeroSerie') {
      setFormData({
        ...formData,
        [name]: value.toUpperCase(),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCancel = () => {
    setFormData(prev => ({
      codigoUnico: prev.codigoUnico,
      marca: '',
      modelo: '',
      numeroSerie: '',
      stockInicial: '',
      costoUnitario: '',
      precioVenta: '',
      proveedor: '',
      ubicacion: '',
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase">Nuevo Producto</h2>
        <Link
          to="/productos"
          className="text-sm text-[#1e6b3e] hover:underline"
        >
          ← Volver a productos
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label htmlFor="codigoUnico" className="block text-xs text-gray-600 mb-1">
                Código Único
              </label>
              <input
                id="codigoUnico"
                name="codigoUnico"
                type="text"
                value={formData.codigoUnico}
                readOnly
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="marca" className="block text-xs text-gray-600 mb-1">Marca</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  id="marca"
                  name="marca"
                  type="text"
                  value={formData.marca}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modelo" className="block text-xs text-gray-600 mb-1">Modelo</label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  id="modelo"
                  name="modelo"
                  type="text"
                  value={formData.modelo}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="numeroSerie" className="block text-xs text-gray-600 mb-1">Número de Serie</label>
              <input
                id="numeroSerie"
                name="numeroSerie"
                type="text"
                value={formData.numeroSerie}
                onChange={handleChange}
                required
                maxLength={15}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e]"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-3">Inventario & Costo</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="stockInicial" className="block text-xs text-gray-600 mb-1">Stock Inicial</label>
                <input
                  id="stockInicial"
                  name="stockInicial"
                  type="number"
                  value={formData.stockInicial}
                  onChange={handleChange}
                  required
                  min="0"
                  max="999"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e]"
                />
              </div>

              <div>
                <label htmlFor="costoUnitario" className="block text-xs text-gray-600 mb-1">Costo Unitario (S/.)</label>
                <input
                  id="costoUnitario"
                  name="costoUnitario"
                  type="number"
                  step="0.01"
                  value={formData.costoUnitario}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e]"
                />
              </div>

              <div>
                <label htmlFor="precioVenta" className="block text-xs text-gray-600 mb-1">Precio de Venta (S/.)</label>
                <input
                  id="precioVenta"
                  name="precioVenta"
                  type="number"
                  step="0.01"
                  value={formData.precioVenta}
                  onChange={handleChange}
                  required
                  min="0.01"
                  max="99999.99"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e]"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-3">Adicional</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="proveedor" className="block text-xs text-gray-600 mb-1">Proveedor</label>
                <select
                  id="proveedor"
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e]"
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((p) => (
                    <option key={p.id_proveedor} value={p.id_proveedor}>
                      {p.razon_social} ({p.id_proveedor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ubicacion" className="block text-xs text-gray-600 mb-1">Ubicación</label>
                <input
                  id="ubicacion"
                  name="ubicacion"
                  type="text"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/productos"
              className="px-6 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors uppercase"
            >
              Cancelar
            </Link>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors uppercase"
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm bg-[#1e6b3e] hover:bg-[#165530] text-white rounded transition-colors uppercase"
            >
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
