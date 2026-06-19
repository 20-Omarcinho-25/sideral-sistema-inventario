import { Outlet, useNavigate, useLocation } from 'react-router';
import { LogOut, User, LayoutDashboard, Package, Search, ShoppingCart, Users, ArrowLeftRight, FileText } from 'lucide-react';
import logoImage from '../../imports/Logo_AIReady.png';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'Usuario';

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/nuevo-producto', label: 'Nuevo Producto', icon: Package },
    { path: '/dashboard/buscar-producto', label: 'Gestionar Productos', icon: Search },
    { path: '/dashboard/venta', label: 'Venta de productos', icon: ShoppingCart },
    { path: '/dashboard/gestionar-proveedores', label: 'Gestionar Proveedores', icon: Users },
    { path: '/dashboard/movimientos', label: 'Movimientos', icon: ArrowLeftRight },
    { path: '/dashboard/reporte', label: 'Reportes', icon: FileText },
  ];

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      '/dashboard': 'Panel de Control',
      '/dashboard/nuevo-producto': 'Registro de Nuevo Producto',
      '/dashboard/buscar-producto': 'Gestión de Productos',
      '/dashboard/venta': 'Punto de Venta',
      '/dashboard/gestionar-proveedores': 'Gestión de Proveedores',
      '/dashboard/movimientos': 'Movimientos de Inventario',
      '/dashboard/reporte': 'Reportes y Estadísticas',
    };
    return titles[location.pathname] || 'Panel de Control de Inventario';
  };

  return (
    <div className="min-h-screen bg-[#e8ecef] print:bg-white flex flex-col">
      {/* Header */}
      <header className="bg-[#1e6b3e] text-white shadow-md print:hidden">
        <div className="px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoImage} alt="AIReady" className="h-8" />
            <div className="h-6 w-px bg-white/30"></div>
            <h1 className="text-lg font-medium">{getPageTitle()}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
              <User size={18} />
              <span className="text-sm font-medium">{username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Hide on dashboard home */}
        {location.pathname !== '/dashboard' && (
          <aside className="w-56 bg-[#1e6b3e] text-white print:hidden">
            <nav className="p-3">
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white font-medium'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content */}
  <main className="flex-1 overflow-y-auto p-6">          <Outlet />
        </main>
      </div>
    </div>
  );

       
}
