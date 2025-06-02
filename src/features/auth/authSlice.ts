import { createSlice } from '@reduxjs/toolkit';

// Interfaz que define los datos básicos del usuario autenticado
interface AuthUser {
  uid: string;
  email: string | null;
}

// Interfaz que define el estado de autenticación en Redux
interface AuthState {
  isAuthenticated: boolean; // Indica si el usuario está autenticado o no
  user: AuthUser | null;    // Información del usuario actual o null si no hay usuario
  role: 'admin' | 'user' | null;  // Rol del usuario, puede ser 'admin', 'user' o null
  isLoading: boolean;       // Estado para controlar si la autenticación está en proceso
}

// Estado inicial de la autenticación
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  isLoading: true,  // Inicia en true asumiendo que se está verificando si hay sesión activa
};

// Creación del slice de autenticación que maneja el estado y reducers asociados
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Acción para actualizar el estado cuando un usuario se loguea exitosamente
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;  // Datos del usuario autenticado
      state.role = action.payload.role;  // Rol del usuario (admin o user)
      state.isLoading = false;            // Finaliza el estado de carga
    },
    // Acción para actualizar el estado cuando el usuario cierra sesión
    logoutSuccess: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.isLoading = false; // Finaliza el estado de carga
    },
    // Acción para indicar que el proceso de carga de autenticación terminó
    finishLoading: (state) => {
      state.isLoading = false;
    }
  },
});

// Exportamos las acciones para usarlas en los componentes o middleware
export const { loginSuccess, logoutSuccess, finishLoading } = authSlice.actions;
// Exportamos el reducer para agregarlo al store
export default authSlice.reducer;
