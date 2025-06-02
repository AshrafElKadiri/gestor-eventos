import { render, screen } from '@testing-library/react';
import EditEvent from '../../pages/admin/EditEvent';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest'; // Importa vi desde vitest

// Simulo la carga de un evento existente
vi.mock('../../features/events/eventService', () => ({
  getEventById: () => Promise.resolve({
    id: '1',
    title: 'Original',
    date: '2024-06-10',
    description: '...',
    location: 'Sevilla',
    imageUrl: '',
    capacity: 100,
    category: 'arte',
  }),
  updateEvent: vi.fn(),
}));

describe('EditEvent', () => {
  test('carga datos del evento correctamente', async () => {
    // Simulo la navegación con MemoryRouter usando una ruta con ID
    render(
      <MemoryRouter initialEntries={['/admin/events/1/edit']}>
        <Routes>
          <Route path="/admin/events/:id/edit" element={<EditEvent />} />
        </Routes>
      </MemoryRouter>
    );

    // Compruebo que los datos del evento se renderizan
    expect(await screen.findByDisplayValue('Original')).toBeInTheDocument();
  });
});
