import { useState, useEffect } from 'react';
import { Calendar, Trash2, Plus, Minus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '../lib/api';
import { ventaSchema, type VentaFormData } from '../lib/validations';

// Normalized product shape used by the UI
interface ProductoDisponible {
  id: string; // original id_producto
  codigo: string; // same as id
  marca: string;
  modelo: string; // original nombre
  precio: number; // original precio
  stock: number; // original stock_actual
}

interface ItemVenta {
  id: string;
  id_producto?: string;
  codigo: string;
  marca: string;
  modelo: string;
  costoUnitario: number;
  cantidad: number;
  subtotal: number;
}

export default function VentaProductos() {
  const today = new Date().toISOString().split('T')[0];
  const [codigoVenta, setCodigoVenta] = useState('Autogenerado por BD');
  const [fecha, setFecha] = useState(today);
  const [cliente, setCliente] = useState('');
  const [dniRuc, setDniRuc] = useState('');
  
  // ESTADOS DINÁMICOS
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoDisponible[]>([]);
  const [searchProducto, setSearchProducto] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [items, setItems] = useState<ItemVenta[]>([]);

  // 1. TRAER CATÁLOGO EN CALIENTE
  useEffect(() => {
    apiFetch('/productos')
      .then(res => res.json())
      .then(data => {
        const raw: Record<string, unknown>[] = data.productos ? data.productos : data;
        const mapped: ProductoDisponible[] = raw.map(p => ({
          id: String(p.id_producto ?? p.id ?? ''),
          codigo: String(p.id_producto ?? ''),
          marca: String(p.marca ?? ''),
          modelo: String(p.nombre ?? p.modelo ?? ''),
          precio: Number(p.precio ?? 0),
          stock: Number(p.stock_actual ?? p.stock ?? 0),
        }));
        setProductosDisponibles(mapped);
      })
      .catch(() => toast.error('Error cargando catálogo'));
  }, []);

  const filteredProductos = searchProducto.trim()
    ? productosDisponibles.filter(p =>
        p.codigo.toLowerCase().includes(searchProducto.toLowerCase()) ||
        p.marca.toLowerCase().includes(searchProducto.toLowerCase()) ||
        p.modelo.toLowerCase().includes(searchProducto.toLowerCase())
      )
    : [];

  // Handlers: agregar, incrementar, decrementar, eliminar, calcular total, cancelar
  function agregarProducto(producto?: ProductoDisponible) {
    const p = producto ?? (filteredProductos.length ? filteredProductos[0] : undefined);
    if (!p) return;

    setItems(prev => {
      const existing = prev.find(it => it.id === p.id);
      if (existing) {
        // increase quantity but do not exceed stock or 100 units
        const nuevaCantidad = Math.min(existing.cantidad + 1, p.stock, 100);
        return prev.map(it =>
          it.id === p.id ? { ...it, cantidad: nuevaCantidad, subtotal: nuevaCantidad * it.costoUnitario } : it
        );
      }

      const newItem: ItemVenta = {
        id: p.id,
        id_producto: p.id,
        codigo: p.codigo,
        marca: p.marca,
        modelo: p.modelo,
        costoUnitario: p.precio,
        cantidad: 1,
        subtotal: p.precio,
      };
      return [...prev, newItem];
    });

    setSearchProducto('');
    setShowSuggestions(false);
  }

  function incrementarCantidad(itemId: string) {
    setItems(prev => prev.map(it => {
      if (it.id === itemId) {
        const nuevaCantidad = Math.min(it.cantidad + 1, 100); // Límite de 100 según backend
        return { ...it, cantidad: nuevaCantidad, subtotal: nuevaCantidad * it.costoUnitario };
      }
      return it;
    }));
  }

  function decrementarCantidad(itemId: string) {
    setItems(prev =>
      prev
        .map(it => (it.id === itemId ? { ...it, cantidad: Math.max(1, it.cantidad - 1), subtotal: Math.max(1, it.cantidad - 1) * it.costoUnitario } : it))
    );
  }

  function eliminarItem(itemId: string) {
    setItems(prev => prev.filter(it => it.id !== itemId));
  }

  function calcularTotal() {
    return items.reduce((sum, it) => sum + it.subtotal, 0);
  }

  function handleCancelar() {
    setItems([]);
    setSearchProducto('');
    setShowSuggestions(false);
  }

  // 2. REGISTRAR VENTA REAL EN LARAVEL
  const handleRegistrarVenta = async () => {
    // Validación con Zod
    const validationResult = ventaSchema.safeParse({
      nombre_cliente: cliente,
      dni_cliente: dniRuc,
      productos: items.map(item => ({
        id_producto: String(item.id_producto),
        cantidad: item.cantidad,
      })),
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const firstError = errors[0];
      toast.error(firstError.message);
      return;
    }

    // Construir Payload igual al StoreVentaRequest.php de Laravel
    const payload = {
      nombre_cliente: cliente,
      dni_cliente: dniRuc,
      productos: items.map(item => ({
        id_producto: String(item.id_producto),
        cantidad: item.cantidad,
      })),
    };

    try {
      const response = await apiFetch('/ventas', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Venta registrada exitosamente en MySQL`);
        setCliente('');
        setDniRuc('');
        setItems([]);
        // Refrescar inventario si es necesario
      } else {
        const errorData = await response.json();
        console.log("Error de Venta:", errorData);
        toast.error('Error: ' + (errorData.message || 'Verifique los datos'));
      }
    } catch (error) {
      toast.error('Fallo de conexión al servidor');
    }
  };

  // ... (EL RETURN SE MANTIENE IGUAL adaptando las variables nuevas) ...

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase">Venta de Producto</h2>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Detalle de la Venta */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Detalle de la Venta</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Código de Venta</label>
              <input
                type="text"
                value={codigoVenta}
                onChange={(e) => setCodigoVenta(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent bg-gray-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Fecha</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Cliente</label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                maxLength={50}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">DNI/RUC</label>
              <input
                type="text"
                value={dniRuc}
                onChange={(e) => {
                  // Solo permitir números
                  const value = e.target.value.replace(/\D/g, '');
                  setDniRuc(value);
                }}
                maxLength={8}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Agregar Producto */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-xs font-semibold text-gray-700 mb-3">Agregar Laptop a la Venta</h3>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por código, marca o modelo (ej: L001, Asus, ROG)..."
                  value={searchProducto}
                  onChange={(e) => {
                    setSearchProducto(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      agregarProducto();
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>

              {/* Dropdown de sugerencias */}
              {showSuggestions && searchProducto.trim() && filteredProductos.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredProductos.map((producto) => (
                    <button
                      key={producto.id}
                      onClick={() => agregarProducto(producto)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{producto.modelo}</p>
                          <p className="text-xs text-gray-600">{producto.codigo} - {producto.marca}</p>
                        </div>
                        <p className="text-sm font-semibold text-[#1e6b3e]">S/ {producto.precio.toFixed(2)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => agregarProducto()}
              className="px-6 py-2 text-sm bg-[#1e6b3e] hover:bg-[#165530] text-white rounded transition-colors uppercase"
            >
              Agregar
            </button>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Código</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Marca</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Modelo</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Costo Unitario (S/.)</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Cantidad</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">Subtotal (S/.)</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-gray-700">{item.codigo}</td>
                  <td className="px-3 py-2.5 text-gray-700">{item.marca}</td>
                  <td className="px-3 py-2.5 text-gray-900">{item.modelo}</td>
                  <td className="px-3 py-2.5 text-right text-gray-900">S/ {item.costoUnitario.toFixed(2)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => decrementarCantidad(item.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                        disabled={item.cantidad <= 1}
                      >
                        <Minus size={14} className={item.cantidad <= 1 ? 'text-gray-300' : 'text-gray-600'} />
                      </button>
                      <span className="w-8 text-center text-gray-900">{item.cantidad}</span>
                      <button
                        onClick={() => incrementarCantidad(item.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Plus size={14} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right text-gray-900">S/ {item.subtotal.toFixed(2)}</td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      onClick={() => eliminarItem(item.id)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total y acciones */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm">
            <span className="font-semibold text-gray-700">TOTAL A PAGAR (IVA / IVC INCLUIDO): </span>
            <span className="text-lg font-bold text-[#1e6b3e]">S/ {calcularTotal().toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCancelar}
              className="px-6 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors uppercase"
            >
              Cancelar
            </button>
            <button
              onClick={handleRegistrarVenta}
              className="px-6 py-2 text-sm bg-[#1e6b3e] hover:bg-[#165530] text-white rounded transition-colors uppercase"
            >
              Registrar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
