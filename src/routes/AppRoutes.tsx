import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { lazy, Suspense } from 'react';
import AdminRoute from './AdminRoute';
import MyEvents from '../pages/MyEvents';

// Usamos React.lazy para cargar los componentes de forma asíncrona y mejorar el rendimiento inicial de la app.
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const CreateEvent = lazy(() => import('../pages/admin/CreateEvent'));
const EditEvent = lazy(() => import('../pages/admin/EditEvent'));
const EventAttendees = lazy(() => import('../pages/admin/EventAttendees'));
const EventDetail = lazy(() => import('../pages/EventDetail'));
const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRoutes() {
  
  return (
    // Suspense permite mostrar un fallback mientras se cargan los componentes de forma diferida.
    <Suspense fallback={<p className="p-4">Cargando página...</p>}>
      <Routes>
        {/* Rutas públicas: accesibles sin iniciar sesión */}
        <Route path="/gestor-eventos" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/gestor-eventos/event/:id" element={<PrivateRoute><EventDetail /></PrivateRoute>} />
        <Route path="/gestor-eventos/login" element={<Login />} />
        <Route path="/gestor-eventos/register" element={<Register />} />
        <Route path="/gestor-eventos/mis-eventos" element={<PrivateRoute><MyEvents /></PrivateRoute>} />

        {/* Rutas de administración: solo accesibles por usuarios con rol 'admin' */}
        <Route path="/gestor-eventos/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/gestor-eventos/admin/events/new" element={<AdminRoute><CreateEvent /></AdminRoute>} />
        <Route path="/gestor-eventos/admin/events/:id/edit" element={<AdminRoute><EditEvent /></AdminRoute>} />
        <Route path="/gestor-eventos/admin/events/:id/attendees" element={<AdminRoute><EventAttendees /></AdminRoute>} />

        {/* Ruta comodín para manejar cualquier URL no definida */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
