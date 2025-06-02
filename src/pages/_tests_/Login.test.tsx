import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { BrowserRouter } from 'react-router-dom';

// Agrupo los tests bajo una descripción común para el componente Login
describe('Login Page', () => {
  // Primer test: verifica que el formulario de login se renderiza correctamente
  test('renderiza el formulario de login', () => {
    render(
      // Envuelo el componente con Redux y Router para que funcione correctamente en test
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    // Compruebo que aparecen los elementos clave del formulario en pantalla
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });

  // Segundo test: verifica que el usuario puede escribir en el campo de email
  test('permite al usuario escribir en el formulario', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );

    // Selecciono el input del correo electrónico mediante su placeholder
    const emailInput = screen.getByPlaceholderText(/correo/i);
    // Simulo que el usuario escribe un email en el input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    // Verifico que el valor del input ha cambiado correctamente
    expect(emailInput).toHaveValue('test@example.com');
  });
});
