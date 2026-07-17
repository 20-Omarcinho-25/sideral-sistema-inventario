import { createBrowserRouter } from 'react-router';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import NuevoProducto from './pages/NuevoProducto';
import BuscarProducto from './pages/BuscarProducto';
import ActualizarStock from './pages/ActualizarStock';
import VentaProductos from './pages/VentaProductos';
import GestionarProveedores from './pages/GestionarProveedores';
import Movimientos from './pages/Movimientos';
import Reporte from './pages/Reporte';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: 'nuevo-producto',
        Component: NuevoProducto,
      },
      {
        path: 'buscar-producto',
        Component: BuscarProducto,
      },
      {
        path: 'actualizar-stock',
        Component: ActualizarStock,
      },
      {
        path: 'venta',
        Component: VentaProductos,
      },
      {
        path: 'gestionar-proveedores',
        Component: GestionarProveedores,
      },
      {
        path: 'movimientos',
        Component: Movimientos,
      },
      {
        path: 'reporte',
        Component: Reporte,
      },
    ],
  },
]);
