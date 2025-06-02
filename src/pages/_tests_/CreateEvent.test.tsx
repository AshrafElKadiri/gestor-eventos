import { render, screen, fireEvent } from '@testing-library/react';
import CreateEvent from '../../pages/admin/CreateEvent';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest'; // Importa vi desde vitest

// Simulo la función createEvent
vi.mock('../../features/events/eventService', () => ({
  createEvent: vi.fn(),
}));

describe('CreateEvent', () => {
  test('permite completar el formulario', () => {
    render(
      <BrowserRouter>
        <CreateEvent />
      </BrowserRouter>
    );

    // Simulo entrada del usuario en el formulario
    fireEvent.change(screen.getByPlaceholderText(/título/i), {
      target: { value: 'Evento de prueba' },
    });
    fireEvent.change(screen.getByPlaceholderText(/ubicación/i), {
      target: { value: 'Valencia' },
    });

    // Compruebo que los valores han sido introducidos correctamente
    expect(screen.getByDisplayValue('Evento de prueba')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Valencia')).toBeInTheDocument();
  });
});
