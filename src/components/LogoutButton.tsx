import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión del usuario
  const handleLogout = async () => {
    await signOut(auth);          // Cierra la sesión en Firebase Authentication
    dispatch(logoutSuccess());    // Actualiza el estado global para reflejar logout
    navigate('/gestor-eventos/login');           // Redirige al usuario a la página de login
  };

  return (
    <button onClick={handleLogout} className="text-red-600 font-semibold">
      Cerrar sesión
    </button>
  );
}
