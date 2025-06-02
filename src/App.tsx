import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';
import useAuthListener from './hooks/useAuthListener';

function App() {

  useAuthListener();

  //Para probar que el ErrorBoundary funciona correctamente
  //throw new Error('Este es un error de prueba en App');
  
  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
