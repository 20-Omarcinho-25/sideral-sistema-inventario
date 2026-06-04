import { useNavigate } from 'react-router';
import { Package, Search, ShoppingCart, Users, ArrowLeftRight, FileText } from 'lucide-react';

export default function DashboardHome() {
  const navigate = useNavigate();

  const modules = [
    {
      title: 'Nuevo Producto',
      description: 'Registra nuevas laptops en el inventario',
      icon: Package,
      path: '/dashboard/nuevo-producto',
      color: 'bg-blue-500',
    },
    {
      title: 'Gestionar Productos',
      description: 'Consulta y gestiona laptops existentes',
      icon: Search,
      path: '/dashboard/buscar-producto',
      color: 'bg-purple-500',
    },
    {
      title: 'Venta de Productos',
      description: 'Procesa ventas de laptops',
      icon: ShoppingCart,
      path: '/dashboard/venta',
      color: 'bg-green-500',
    },
    {
      title: 'Gestionar Proveedores',
      description: 'Administra proveedores del sistema',
      icon: Users,
      path: '/dashboard/gestionar-proveedores',
      color: 'bg-indigo-500',
    },
    {
      title: 'Movimientos',
      description: 'Registro de movimientos de inventario',
      icon: ArrowLeftRight,
      path: '/dashboard/movimientos',
      color: 'bg-orange-500',
    },
    {
      title: 'Reporte',
      description: 'Genera reporte de inventario',
      icon: FileText,
      path: '/dashboard/reporte',
      color: 'bg-red-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl mb-3 text-gray-800">Bienvenido a AIReady</h1>
      <p className="text-gray-600 mb-6">Sistema de Gestión de Inventario y Ventas de Laptops</p>

      <div className="grid grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <button
              key={module.path}
              onClick={() => navigate(module.path)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow text-left group"
            >
              <div className={`${module.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600">{module.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg mb-4 text-gray-700">Resumen Rápido</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Laptops en Inventario</p>
            <p className="text-2xl font-bold text-gray-900">65</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Bajo Stock</p>
            <p className="text-2xl font-bold text-orange-600">8</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Ventas Hoy</p>
            <p className="text-2xl font-bold text-green-600">S/ 16,499</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Laptops Vendidas</p>
            <p className="text-2xl font-bold text-blue-600">5</p>
          </div>
        </div>
      </div>
    </div>
  );
}
