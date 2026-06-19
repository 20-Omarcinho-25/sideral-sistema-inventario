import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout'; // <-- Tu Layout padre
import DashboardHome from './pages/DashboardHome';       // <-- Tu vista principal
// ... importa tus otras vistas (Proveedores, Ventas, etc.)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas Privadas (Anidadas dentro del Layout) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Al poner index, DashboardHome carga por defecto al entrar a /dashboard */}
          <Route index element={<DashboardHome />} />
          
          {/* Aquí irán cayendo las demás ventanas de tu menú */}
          {/* <Route path="proveedores" element={<Proveedores />} /> */}
          {/* <Route path="ventas" element={<Ventas />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}