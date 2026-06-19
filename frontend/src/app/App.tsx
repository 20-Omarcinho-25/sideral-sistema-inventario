import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login'; // Asegúrate de que las rutas de importación sean correctas
import DashboardLayout from './components/DashboardLayout'; // La ruta al archivo que creamos arriba
import DashboardHome from './pages/DashboardHome'; // La vista de los cuadros que tienes en tu foto

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública (El login ocupa toda la pantalla) */}
        <Route path="/" element={<Login />} />

        {/* RUTAS PRIVADAS (Envueltas obligatoriamente en el Layout) */}
        {/* Fíjate que el elemento principal es DashboardLayout, y las demás rutas van ADENTRO */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          {/* Aquí irás agregando tus demás pantallas */}
          {/* <Route path="/proveedores" element={<Proveedores />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}