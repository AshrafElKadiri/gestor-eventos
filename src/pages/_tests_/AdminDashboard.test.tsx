import { render, screen } from '@testing-library/react';
import AdminDashboard from '../../pages/admin/Dashboard';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest'; // Importa vi desde vitest

// Simulo el servicio de eventos
vi.mock('../../features/events/eventService', () => ({
  getEvents: () => Promise.resolve([
    {
      id: '1',
      title: 'Feria de Arte',
      date: '2024-07-01',
      location: 'Granada',
      category: 'arte',
    },
  ]),
  deleteEvent: vi.fn(),
}));

describe('AdminDashboard', () => {
  test('muestra eventos en el panel de administración', async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    // Verifico que el evento simulado aparece en pantalla
    expect(await screen.findByText(/Feria de Arte/i)).toBeInTheDocument();
  });
});
