import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import type { JSX } from 'react';

export default function AdminRoute({ children }: { children: JSX.Element }) {
  // Obtenemos del estado global si el usuario está autenticado, su rol, y si todavía se está cargando la sesión.
  const { isAuthenticated, role, isLoading } = useSelector((state: RootState) => state.auth);
  
  // Mientras se está determinando si hay sesión iniciada (por ejemplo, al refrescar la página), se muestra un mensaje de carga.
  if (isLoading) return <div className="p-6 text-center">Cargando sesión...</div>;

  // Si el usuario no está autenticado, se le redirige a la página de login.
  if (!isAuthenticated) return <Navigate to="/gestor-eventos/login" replace />;
  // Si el usuario no es administrador, se le redirige a la página principal.
  if (role !== 'admin') return <Navigate to="/gestor-eventos" replace />;

  // Si pasa todas las comprobaciones, se le permite acceder al contenido protegido (children).
  return children;
}
