import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import type { JSX } from 'react';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  // Extraemos del estado global los indicadores de sesión activa y de carga.
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  // Mientras el estado de autenticación se está determinando, mostramos un mensaje de carga.  
  if (isLoading) {
    return <div className="p-6 text-center">Cargando sesión...</div>;
  }

  // Si el usuario está autenticado, se le permite ver el contenido (children), que será el componente correspondiente a esa ruta.
  // Si no lo está, se redirige automáticamente a la página de login.
  return isAuthenticated ? children : <Navigate to="/gestor-eventos/login" />;
}
