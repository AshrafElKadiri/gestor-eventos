import { render, screen } from '@testing-library/react';
import Home from '../Home';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest'; // Importa vi desde vitest

// Simulo el servicio que devuelve eventos
vi.mock('../../features/events/eventService', () => ({
  getEvents: () => Promise.resolve([
    {
      id: '1',
      title: 'Concierto',
      date: '2024-06-01',
      description: 'Descripción...',
      imageUrl: '',
      location: 'Madrid',
      category: 'música',
    },
  ]),
}));

describe('Home', () => {
  test('renderiza eventos disponibles', async () => {
    // Renderizo el componente Home dentro de BrowserRouter (necesario por los <Link>)
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Verifico que se muestra el título del evento
    expect(await screen.findByText(/Concierto/i)).toBeInTheDocument();
  });
});
