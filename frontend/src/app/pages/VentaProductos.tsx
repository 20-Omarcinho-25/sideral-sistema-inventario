import { useState } from 'react';
import { Calendar, Trash2, Plus, Minus, Search } from 'lucide-react';
import { toast } from 'sonner';

interface ItemVenta {
  id: number;
  codigo: string;
  marca: string;
  modelo: string;
  costoUnitario: number;
  cantidad: number;
  subtotal: number;
}

interface ProductoDisponible {
  id: number;
  codigo: string;
  marca: string;
  modelo: string;
  precio: number;
}

const productosDisponibles: ProductoDisponible[] = [
  { id: 1, codigo: 'L001', marca: 'ASUS', modelo: 'ASUS Vivobook 15', precio: 2499 },
  { id: 2, codigo: 'L002', marca: 'Apple', modelo: 'MacBook Air M2 13"', precio: 4800 },
  { id: 3, codigo: 'L003', marca: 'HP', modelo: 'HP Pavilion Gaming 15', precio: 3200 },
  { id: 4, codigo: 'L004', marca: 'Lenovo', modelo: 'Lenovo IdeaPad 3', precio: 1850 },
  { id: 5, codigo: 'L005', marca: 'Dell', modelo: 'Dell XPS 13', precio: 5100 },
  { id: 6, codigo: 'L006', marca: 'Acer', modelo: 'Acer Nitro 5', precio: 3550 },
  { id: 7, codigo: 'L007', marca: 'MSI', modelo: 'MSI Katana GF66', precio: 4100 },
  { id: 8, codigo: 'L008', marca: 'Huawei', modelo: 'Huawei MateBook D14', precio: 2200 },
  { id: 9, codigo: 'L009', marca: 'Samsung', modelo: 'Samsung Galaxy Book3', precio: 3900 },
  { id: 10, codigo: 'L010', marca: 'Microsoft', modelo: 'Microsoft Surface Laptop 5', precio: 4500 },
];

export default function VentaProductos() {
  const today = new Date().toISOString().split('T')[0];
  const [codigoVenta, setCodigoVenta] = useState('V-' + Date.now());
  const [fecha, setFecha] = useState(today);
  const [cliente, setCliente] = useState('');
  const [dniRuc, setDniRuc] = useState('');
  const [searchProducto, setSearchProducto] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [items, setItems] = useState<ItemVenta[]>([]);

  const filteredProductos = searchProducto.trim()
    ? productosDisponibles.filter(p =>
        p.codigo.toLowerCase().includes(searchProducto.toLowerCase()) ||
        p.marca.toLowerCase().includes(searchProducto.toLowerCase()) ||
        p.modelo.toLowerCase().includes(searchProducto.toLowerCase())
      )
    : [];

  const agregarProducto = (producto?: ProductoDisponible) => {
    let productoSeleccionado = producto;

    if (!productoSeleccionado) {
      if (!searchProducto.trim()) {
        toast.error('Ingrese un término de búsqueda');
        return;
      }

      const searchTerm = searchProducto.toLowerCase();
      productoSeleccionado = productosDisponibles.find(
        p => p.codigo.toLowerCase().includes(searchTerm) ||
             p.marca.toLowerCase().includes(searchTerm) ||
             p.modelo.toLowerCase().includes(searchTerm)
      );

      if (!productoSeleccionado) {
        toast.error('Laptop no encontrada. Intente con: código, marca o modelo');
        return;
      }
    }

    const itemExistente = items.find(item => item.codigo === productoSeleccionado!.codigo);

    if (itemExistente) {
      incrementarCantidad(itemExistente.id);
      toast.success(`Cantidad de ${productoSeleccionado!.modelo} incrementada`);
    } else {
      const nuevoItem: ItemVenta = {
        id: Date.now(),
        codigo: productoSeleccionado!.codigo,
        marca: productoSeleccionado!.marca,
        modelo: productoSeleccionado!.modelo,
        costoUnitario: productoSeleccionado!.precio,
        cantidad: 1,
        subtotal: productoSeleccionado!.precio
      };
      setItems([...items, nuevoItem]);
      toast.success(`${productoSeleccionado!.modelo} agregada`);
    }

    setSearchProducto('');
    setShowSuggestions(false);
  };

  const incrementarCantidad = (id: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + 1;
        return { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.costoUnitario };
      }
      return item;
    }));
  };

  const decrementarCantidad = (id: number) => {
    setItems(items.map(item => {
      if (item.id === id && item.cantidad > 1) {
        const nuevaCantidad = item.cantidad - 1;
        return { ...item, cantidad: nuevaCantidad, subtotal: nuevaCantidad * item.costoUnitario };
      }
      return item;
    }));
  };

  const eliminarItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleCancelar = () => {
    setCodigoVenta('V-' + Date.now());
    setCliente('');
    setDniRuc('');
    setItems([]);
    toast.info('Venta cancelada');
  };

  const handleRegistrarVenta = () => {
    if (items.length === 0) {
      toast.error('No hay productos en la venta');
      return;
    }

    if (!cliente.trim()) {
      toast.error('Debe ingresar el nombre del cliente');
      return;
    }

    toast.success(`Venta registrada exitosamente. Total: S/ ${calcularTotal().toFixed(2)}`);
    setCodigoVenta('V-' + Date.now());
    setCliente('');
    setDniRuc('');
    setItems([]);
  };

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
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">DNI/RUC</label>
              <input
                type="text"
                value={dniRuc}
                onChange={(e) => setDniRuc(e.target.value)}
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
