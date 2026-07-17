import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import GestionarProveedores from './pages/GestionarProveedores';
import Reportes from './pages/Reporte';
import BuscarProducto from './pages/BuscarProducto';
import NuevoProducto from './pages/NuevoProducto';
import ActualizarStock from './pages/ActualizarStock';
import VentaProductos from './pages/VentaProductos';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/proveedores" element={<GestionarProveedores />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/productos" element={<BuscarProducto />} />
          <Route path="/productos/nuevo" element={<NuevoProducto />} />
          <Route path="/productos/stock" element={<ActualizarStock />} />
          <Route path="/ventas" element={<VentaProductos />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
