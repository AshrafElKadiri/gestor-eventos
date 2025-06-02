import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { finishLoading, loginSuccess, logoutSuccess } from '../features/auth/authSlice';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function useAuthListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    // onAuthStateChanged se ejecuta cada vez que cambia el estado de sesión en Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Si hay un usuario autenticado, consultamos su documento en Firestore
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);

        // Obtenemos el rol del documento si existe, por defecto 'user'
        const role = snap.exists() ? snap.data().role : 'user';

         // Creamos un objeto seguro del usuario
        const safeUser = {
          uid: user.uid,
          email: user.email
        };

        // Actualizamos el estado de autenticación en Redux
        dispatch(loginSuccess({ user: safeUser, role }));
      } else {
        // Si no hay usuario (sesión cerrada), lanzamos logout
        dispatch(logoutSuccess());
      }
      // Indicamos que se ha terminado de verificar el estado de sesión
      dispatch(finishLoading());
    });

    // Devolvemos una función de limpieza que se ejecuta cuando se desmonta el componente
    return () => unsubscribe();
  }, [dispatch]);
}
