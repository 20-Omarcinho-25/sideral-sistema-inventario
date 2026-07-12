import { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';

export default function DashboardLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleCerrarSesion = async () => {
    try {
      await apiFetch('/logout', { method: 'POST' });
    } catch {
      // Ignorar error de red al cerrar sesión
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      navigate('/');
    }
  };

  const usuarioRaw = localStorage.getItem('usuario');
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) as { nombre?: string; id_rol?: string } : null;
  const rolLabel = usuario?.id_rol === 'R002' ? 'Vendedor' : 'Administrador';

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 bg-gray-950 text-center border-b border-gray-800">
          <h2 className="text-2xl font-bold text-green-400">AI<span className="text-white">Ready</span></h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/dashboard" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            🏠 Dashboard
          </Link>
          <Link to="/proveedores" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            👥 Proveedores
          </Link>
          <Link to="/productos" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            📦 Productos
          </Link>
          <Link to="/ventas" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            🛒 Ventas
          </Link>
          <Link to="/reportes" className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            📄 Reportes
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleCerrarSesion}
            className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors font-medium"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Sistema Sideral</h1>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {usuario?.nombre ?? localStorage.getItem('username') ?? 'Usuario'} · {rolLabel}
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
