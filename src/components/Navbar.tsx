import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { logoutSuccess } from '../features/auth/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  // Obtener estado de autenticación y rol del usuario desde Redux
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { t } = useTranslation(); // Hook para traducciones

  // Función para cerrar sesión del usuario
  const handleLogout = async () => {
    await signOut(auth);            // Cierra sesión en Firebase Auth
    dispatch(logoutSuccess());      // Actualiza estado global indicando logout
    navigate('/gestor-eventos/login');             // Redirige a la página de login
  };

  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white px-6 py-4 shadow-md">
      <Link to="/gestor-eventos" className="text-xl font-bold text-white">Eventia</Link>
      <div className="flex gap-4 items-center">
        {!isAuthenticated ? (
          <>
            <Link to="/gestor-eventos/login">{t('button.login')}</Link>
            <Link to="/gestor-eventos/register">{t('button.register')}</Link>
          </>
        ) : (
          <>
            {role === 'admin' && <Link to="/gestor-eventos/admin">{t('admin.panel')}</Link>}
            <button onClick={handleLogout} className="text-red-400 hover:underline">
              {t('button.logout')}
            </button>
            <Link to="/gestor-eventos/mis-eventos">{t('button.myevents')}</Link>
          </>
        )}
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
