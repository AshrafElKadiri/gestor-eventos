import { render, screen } from '@testing-library/react';
import EventDetail from '../EventDetail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import { vi } from 'vitest'; // Importa vi desde vitest

// Simulo funciones relacionadas con eventos y registros
vi.mock('../../features/events/eventService', () => ({
  getEventById: () => Promise.resolve({
    id: '1',
    title: 'Taller X',
    date: '2024-06-20',
    description: 'Detalles del taller',
    capacity: 50,
    location: 'Barcelona',
    category: 'tecnología',
  }),
  getRegistrations: () => Promise.resolve([]),
  isUserRegistered: () => Promise.resolve(false),
}));

describe('EventDetail', () => {
  test('muestra información del evento', async () => {
    // Renderizo el componente con Redux y Router
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/event/1']}>
          <Routes>
            <Route path="/event/:id" element={<EventDetail />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Verifico que se muestra el nombre del evento
    expect(await screen.findByText(/Taller X/i)).toBeInTheDocument();
  });
});
