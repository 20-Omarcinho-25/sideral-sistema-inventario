import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

export default function NuevoProducto() {
  const [codigoCounter, setCodigoCounter] = useState(11);
  const [formData, setFormData] = useState({
    codigoUnico: '',
    marca: '',
    modelo: '',
    numeroSerie: '',
    stockInicial: '',
    costoUnitario: '',
    precioVenta: '',
    proveedor: '',
    ubicacion: '',
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      codigoUnico: `L${String(codigoCounter).padStart(3, '0')}`
    }));
  }, [codigoCounter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mapeamos los campos del FrontEnd a los nombres exactos que espera la BD de Laravel
    const payload = {
      num_serie: formData.numeroSerie,
      nombre: formData.modelo,      // Tu 'modelo' de Figma es el 'nombre' en Laravel
      marca: formData.marca,
      precio: parseFloat(formData.precioVenta), 
      stock_actual: parseInt(formData.stockInicial),
      stock_minimo: 5,              // Dato requerido por tu Request, lo definimos en 5 por defecto
      id_proveedor: formData.proveedor, 
    };

    try {
      // 2. Hacemos la petición POST a Laravel en caliente
      const response = await fetch('http://localhost:8000/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Inserción exitosa en la base de datos MySQL
        toast.success('Producto creado y guardado en la Base de Datos');
        setCodigoCounter(prev => prev + 1);
        handleCancel(); // Limpia el formulario
      } else {
        // Manejo de errores si fallan tus 3 validaciones de Laravel
        const errorData = await response.json();
        console.log("Errores de validación:", errorData);
        toast.error('Error al crear: Verifica los datos (Ej: ID Proveedor debe existir)');
      }
    } catch (error) {
      toast.error('Error fatal de conexión con el servidor de Laravel');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setFormData({
      codigoUnico: `L${String(codigoCounter).padStart(3, '0')}`,
      marca: '',
      modelo: '',
      numeroSerie: '',
      stockInicial: '',
      costoUnitario: '',
      precioVenta: '',
      proveedor: '',
      ubicacion: '',
    });
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase">Nuevo Producto</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Primera fila */}
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
              <label htmlFor="marca" className="block text-xs text-gray-600 mb-1">
                Marca
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  id="marca"
                  name="marca"
                  type="text"
                  value={formData.marca}
                  onChange={handleChange}
                  placeholder="Marca"
                  maxLength={50}
                  required
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modelo" className="block text-xs text-gray-600 mb-1">
                Modelo
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  id="modelo"
                  name="modelo"
                  type="text"
                  value={formData.modelo}
                  onChange={handleChange}
                  placeholder="Modelo"
                  maxLength={50}
                  required
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="numeroSerie" className="block text-xs text-gray-600 mb-1">
                Número de Serie
              </label>
              <input
                id="numeroSerie"
                name="numeroSerie"
                type="text"
                value={formData.numeroSerie}
                onChange={handleChange}
                placeholder="Número de Serie"
                maxLength={15}
                  required
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
              />
            </div>
          </div>

          {/* Inventario & Costo */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-3">Inventario & Costo</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="stockInicial" className="block text-xs text-gray-600 mb-1">
                  Stock Inicial
                </label>
                <input
                  id="stockInicial"
                  name="stockInicial"
                  type="number"
                  value={formData.stockInicial}
                  onChange={handleChange}
                  placeholder="1"
                  min="0"
                  max="99999"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="costoUnitario" className="block text-xs text-gray-600 mb-1">
                  Costo Unitario (S/.)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/</span>
                  <input
                    id="costoUnitario"
                    name="costoUnitario"
                    type="number"
                    step="0.01"
                    value={formData.costoUnitario}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="precioVenta" className="block text-xs text-gray-600 mb-1">
                  Precio de Venta (S/.)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">S/</span>
                  <input
                    id="precioVenta"
                    name="precioVenta"
                    type="number"
                    step="0.01"
                    value={formData.precioVenta}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    max="99999"
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Adicional */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-3">Adicional</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="proveedor" className="block text-xs text-gray-600 mb-1">
                  Proveedor
                </label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <select
                    id="proveedor"
                    name="proveedor"
                    value={formData.proveedor}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent appearance-none"
                  >
                    <option value="">Seleccionar</option>
                    <option value="proveedor1">Proveedor 1</option>
                    <option value="proveedor2">Proveedor 2</option>
                    <option value="proveedor3">Proveedor 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="ubicacion" className="block text-xs text-gray-600 mb-1">
                  Ubicación
                </label>
                <input
                  id="ubicacion"
                  name="ubicacion"
                  type="text"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  placeholder="Ubicación"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors uppercase"
            >
              Cancelar
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
