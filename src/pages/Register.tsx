import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook de React Router para navegación programática

  const { t } = useTranslation();

  // Función que maneja el registro cuando se envía el formulario
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Crea un nuevo usuario en Firebase Authentication con email y contraseña
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Crea un documento en Firestore para almacenar información adicional del usuario
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role: 'user',
    });
      
      // Redirige al usuario a la ruta /admin tras registrarse correctamente
      navigate('/gestor-eventos');
    } catch (err) {
      alert("Error al registrar: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {t('register.user')}
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder={t('register.placeholderEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <input
            type="password"
            placeholder={t('register.placeholderPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded font-semibold hover:bg-green-600 transition"
          >
            {t('button.register')}
          </button>
        </div>
      </form>
    </div>
  );
}