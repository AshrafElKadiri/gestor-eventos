/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { getEvents, deleteEvent } from '../../features/events/eventService';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  // Estado para almacenar la lista de eventos, inicialmente vacío
  const [events, setEvents] = useState<any[]>([]);

   const { t } = useTranslation();

  // Función asincrónica que obtiene los eventos desde el servicio y actualiza el estado
  const loadEvents = async () => {
    const data = await getEvents();
    setEvents(data);
  };

  // Función para eliminar un evento dado su id
  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      await deleteEvent(id);
      loadEvents();
    }
  };

  // useEffect para cargar los eventos cuando el componente se monta
  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{t('admin.title')}</h1>
        <Link
          to="/gestor-eventos/admin/events/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          {t('admin.create')}
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500 text-center">{t('admin.noEvents')}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border rounded-lg shadow-md p-5 flex flex-col justify-between"
            >
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="rounded mb-3 w-full h-40 object-cover"
                />
              )}

              <div>
                <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-600 mt-1">{event.location} · {event.category}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to={`/gestor-eventos/event/${event.id}`}
                  className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
                >
                  {t('admin.view')}
                </Link>
                <Link
                  to={`/gestor-eventos/admin/events/${event.id}/edit`}
                  className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
                >
                  {t('admin.edit')}
                </Link>
                <Link
                  to={`/gestor-eventos/admin/events/${event.id}/attendees`}
                  className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200"
                >
                  {t('admin.attendees')}
                </Link>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                >
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}