import { useState, useEffect } from 'react';
import { DollarSign, AlertTriangle, Users, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface Metricas {
  ventas_mes: number;
  bajo_stock: number;
  proveedores_activos: number;
  ventas_recientes: any[];
}

export default function DashboardHome() {
  // 1. Estados inicializados en cero o vacío
  const [metricas, setMetricas] = useState<Metricas>({
    ventas_mes: 0,
    bajo_stock: 0,
    proveedores_activos: 0,
    ventas_recientes: []
  });
  const [cargando, setCargando] = useState(true);

  // 2. Carga en caliente al montar el Dashboard
  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard/metricas', {
          headers: { 'Accept': 'application/json' }
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Descomentar si usan auth
        });
        
        if (response.ok) {
          const data = await response.json();
          setMetricas(data);
        } else {
          toast.error('Error al cargar métricas del servidor');
        }
      } catch (error) {
        toast.error('Error de conexión con Laravel');
      } finally {
        setCargando(false);
      }
    };

    fetchMetricas();
  }, []);

  if (cargando) return <div className="p-8 text-center text-gray-500">Calculando métricas del negocio...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Resumen Operativo</h2>

      {/* Tarjetas de Métricas Dinámicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tarjeta 1: Ventas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-700 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Ingresos del Mes</p>
            <p className="text-2xl font-bold text-gray-900">S/ {metricas.ventas_mes.toFixed(2)}</p>
          </div>
        </div>

        {/* Tarjeta 2: Alertas de Stock */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className={`p-3 rounded-full ${metricas.bajo_stock > 0 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Laptops con Bajo Stock</p>
            <p className="text-2xl font-bold text-gray-900">{metricas.bajo_stock} Equipos</p>
          </div>
        </div>

        {/* Tarjeta 3: Proveedores */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Proveedores Activos</p>
            <p className="text-2xl font-bold text-gray-900">{metricas.proveedores_activos}</p>
          </div>
        </div>
      </div>

      {/* Tabla de Ventas Recientes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Últimas 5 Transacciones</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">ID Venta</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {metricas.ventas_recientes.map((venta, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">VNT-{venta.id_venta}</td>
                <td className="px-4 py-3 text-gray-600">{venta.nombre_cliente}</td>
                <td className="px-4 py-3 text-gray-600">{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right font-semibold text-[#1e6b3e]">S/ {Number(venta.total).toFixed(2)}</td>
              </tr>
            ))}
            {metricas.ventas_recientes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No hay ventas registradas este mes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}