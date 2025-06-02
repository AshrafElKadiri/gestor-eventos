/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { db } from '../firebase/firebaseConfig';
import { collectionGroup, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { logInfo, logError } from '../utils/logger';
import { useTranslation } from 'react-i18next';

export default function MyEvents() {
  // Obtener el usuario autenticado del store global de Redux
  const user = useSelector((state: RootState) => state.auth.user);
  // Estado para guardar los eventos en los que el usuario está inscrito
  const [events, setEvents] = useState<any[]>([]);
  // Estado para controlar el indicador de carga mientras se obtienen datos
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  // Función para cargar los eventos a los que está inscrito el usuario
  const loadMyEvents = async () => {
    if (!user) return;
    setLoading(true);
    try {
      
      // Obtener todos los documentos en la colección 'registrations' de cualquier evento
      const snap = await getDocs(collectionGroup(db, 'registrations'));

      // Filtrar registros que correspondan al usuario actual (comparando con user.uid)
      const myRegistrations = snap.docs.filter((doc) => doc.id === user.uid);

      // Mapear las inscripciones para extraer eventId y los datos del registro
      const eventRefs = myRegistrations.map((reg) => ({
        eventId: reg.ref.parent.parent?.id,
        ...reg.data(),
      }));

      // Obtener todos los documentos de la colección 'events' para poder juntar datos
      const allEventDocs = await getDocs(collectionGroup(db, 'events'));

       // Combinar los datos de las inscripciones con los datos completos del evento
      const fullEvents = eventRefs.map((r) => {
        const matched = allEventDocs.docs.find((e) => e.id === r.eventId);
        return matched ? { id: matched.id, ...matched.data(), ...r } : null;
      });

      // Guardar los eventos combinados en el estado, filtrando valores nulos
      setEvents(fullEvents.filter(Boolean));
      logInfo('Eventos del usuario cargados', { uid: user.uid, count: fullEvents.length });
    } catch (err) {
      logError('Error al cargar eventos del usuario', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para permitir que el usuario se desinscriba de un evento
  const handleUnregister = async (eventId: string) => {
    if (!user) return;
    if (confirm(t('myEvents.confirmUnregister'))) {
      try {
        // Eliminar documento de inscripción del usuario en el evento especificado
        await deleteDoc(doc(db, `events/${eventId}/registrations/${user.uid}`));
        logInfo('Usuario desinscrito del evento', { uid: user.uid, eventId });
        await loadMyEvents();
      } catch (err) {
        logError('Error al desinscribirse del evento', err);
        alert(t('myEvents.unregisterError'));
      }
    }
  };

  // useEffect para cargar eventos cuando cambia el usuario autenticado
  useEffect(() => {
    loadMyEvents();
  }, [user]);

  // Mostrar mensaje si no hay usuario autenticado
  if (!user)
    return <p className="p-6 text-center text-gray-600">{t('myEvents.loginRequired')}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('myEvents.title')}</h2>

      {loading ? (
        <p className="text-center text-gray-500">{t('myEvents.loading')}</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-600">{t('myEvents.noEvents')}</p>
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
                <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-600 mb-3">{event.location} · {event.category}</p>
              </div>

              <div className="flex flex-wrap gap-3 mt-2">
                <Link
                  to={`/event/${event.id}`}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                >
                  {t('myEvents.view')}
                </Link>
                <button
                  onClick={() => handleUnregister(event.id)}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm"
                >
                  {t('myEvents.unregister')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}