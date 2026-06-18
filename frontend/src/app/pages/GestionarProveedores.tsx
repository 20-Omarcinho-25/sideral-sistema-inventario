import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Proveedor {
  id_proveedor: string;
  razon_social: string;
  ruc: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado: boolean | number;
}


export default function GestionarProveedores() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Proveedor>({
    id_proveedor: '',
    razon_social: '',
    ruc: '',
    telefono: '',
    correo: '',
    direccion: '',
    estado: true,
  });
// 2. CONSULTA EN CALIENTE: Traer proveedores de Laravel
  const fetchProveedores = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/proveedores');
      const data = await response.json();
      setProveedores(data.data ? data.data : data); // Soporta si está paginado o no
    } catch (error) {
      toast.error('Error al conectar con la base de datos');
    }
  };
  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleAddNew = () => {
    const nextId = `P${String(proveedores.length + 1).padStart(3, '0')}`;
    setFormData({
      id_proveedor: '',
      razon_social: '',
      ruc: '',
      telefono: '',
      correo: '',
      direccion: '',
      estado: true,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setFormData(proveedor);
    setEditingId(proveedor.id_proveedor);
    setShowForm(true);
  };

// 3. ELIMINAR EN CALIENTE
  const handleDelete = async (id: string) => {
    if(!confirm('¿Estás seguro de eliminar este proveedor?')) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/proveedores/${id}`, { method: 'DELETE' });
      if(res.ok) {
        toast.success('Proveedor eliminado exitosamente');
        fetchProveedores(); // Refrescar tabla
      }
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  // 4. GUARDAR/ACTUALIZAR EN CALIENTE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const url = editingId 
      ? `http://localhost:8000/api/proveedores/${editingId}` // PUT
      : `http://localhost:8000/api/proveedores`; // POST
      
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(editingId ? 'Actualizado en BD' : 'Guardado en BD');
        setShowForm(false);
        setEditingId(null);
        fetchProveedores(); // Refrescar datos
      } else {
        const errorData = await response.json();
        console.log(errorData);
        toast.error('Error de validación en Laravel (Revisar RUC o campos)');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      id_proveedor: '',
      razon_social: '',
      ruc: '',
      telefono: '',
      correo: '',
      direccion: '',
      estado: true,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase">Gestionar Proveedores</h2>
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1e6b3e] hover:bg-[#165530] text-white rounded transition-colors uppercase"
          >
            <Plus size={16} />
            Nuevo Proveedor
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase">
            {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="id_proveedor" className="block text-xs text-gray-600 mb-1">
                  ID Proveedor
                </label>
                <input
                  id="id_proveedor"
                  name="id_proveedor"
                  type="text"
                  value={formData.id_proveedor}
                  readOnly
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded bg-gray-50 text-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="razon_social" className="block text-xs text-gray-600 mb-1">
                  Razón Social
                </label>
                <input
                  id="razon_social"
                  name="razon_social"
                  type="text"
                  value={formData.razon_social}
                  onChange={handleChange}
                  placeholder="Razón Social"
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="ruc" className="block text-xs text-gray-600 mb-1">
                  RUC
                </label>
                <input
                  id="ruc"
                  name="ruc"
                  type="text"
                  value={formData.ruc}
                  onChange={handleChange}
                  placeholder="RUC (11 dígitos)"
                  maxLength={11}
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-xs text-gray-600 mb-1">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="text"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono (9 dígitos)"
                  maxLength={9}
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="correo" className="block text-xs text-gray-600 mb-1">
                  Correo Electrónico
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="direccion" className="block text-xs text-gray-600 mb-1">
                  Dirección
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Dirección"
                  required
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#1e6b3e] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="estado"
                name="estado"
                type="checkbox"
                checked={Boolean(formData.estado)}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-[#1e6b3e] focus:ring-[#1e6b3e]"
              />
              <label htmlFor="estado" className="text-sm text-gray-700">
                Proveedor Activo
              </label>
            </div>

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
                {editingId ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Proveedores */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">ID</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Razón Social</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">RUC</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Teléfono</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Correo</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">Dirección</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Estado</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proveedores.map((proveedor) => (
                <tr key={proveedor.id_proveedor} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-gray-700">{proveedor.id_proveedor}</td>
                  <td className="px-3 py-2.5 text-gray-900">{proveedor.razon_social}</td>
                  <td className="px-3 py-2.5 text-gray-700">{proveedor.ruc}</td>
                  <td className="px-3 py-2.5 text-gray-700">{proveedor.telefono}</td>
                  <td className="px-3 py-2.5 text-gray-700">{proveedor.correo}</td>
                  <td className="px-3 py-2.5 text-gray-700">{proveedor.direccion}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded ${
                        proveedor.estado
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {proveedor.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(proveedor)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(proveedor.id_proveedor)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
