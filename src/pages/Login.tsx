/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { logInfo, logError } from '../utils/logger';
import { useTranslation } from 'react-i18next';

export default function Login() {
  // Estados locales para email, contraseña y errores del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Obtenemos el dispatch para ejecutar acciones de Redux
  const dispatch = useDispatch();
  // Hook para redirigir tras el login
  const navigate = useNavigate();

  const { t } = useTranslation();

  // Función que se ejecuta al enviar el formulario
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que se recargue la página
    setError('');

    try {
      // Registramos en consola el intento de login
      logInfo('Intento de login iniciado', { email });

      // Intentamos iniciar sesión con Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Buscamos en Firestore el documento del usuario para obtener su rol
      const docRef = doc(db, 'users', userCredential.user.uid);
      const snap = await getDoc(docRef);
      const role = snap.exists() ? snap.data().role : 'user';

      // Creamos un objeto con solo la información segura del usuario
      const safeUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };

      // Guardamos el estado de sesión en Redux
      dispatch(loginSuccess({ user: safeUser, role }));

      // Registramos el login exitoso en la consola
      logInfo('Login exitoso', { uid: safeUser.uid, role });

       // Redirigimos según el rol del usuario
      navigate(role === 'admin' ? '/gestor-eventos/admin' : '/gestor-eventos');
      
    } catch (err: any) {
      logError('Error en login', { email, message: err.message });
      setError('Credenciales inválidas o error en el servidor.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {t('button.login')}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder={t('login.placeholderEmail')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          placeholder={t('login.placeholderPassword')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          {t('button.enter')}
        </button>
      </form>
    </div>
  );
}
