/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'react-router-dom';
import { getEventById, getRegistrations, isUserRegistered, registerUserToEvent } from '../features/events/eventService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { logInfo, logError } from '../utils/logger';
import { useTranslation } from 'react-i18next';

export default function EventDetail() {
  const { id } = useParams(); // Obtener el id del evento de la URL
  const [event, setEvent] = useState<any>(null); // Estado para guardar los detalles del evento
  const [attendees, setAttendees] = useState<any[]>([]); // Estado para guardar la lista de asistentes registrados al evento
  const [isRegistered, setIsRegistered] = useState(false); // Estado para saber si el usuario actual ya está registrado
  const user = useSelector((state: RootState) => state.auth.user); // Obtener el usuario actual desde Redux (estado global)
  const { t } = useTranslation(); 

  // useEffect que se ejecuta al montar el componente o cambiar el id o el usuario
  useEffect(() => {
    if (id) {
      // Obtener detalles del evento por id
      getEventById(id)
        .then(data => {
          setEvent(data);
          logInfo('Evento cargado', data);
        })
        .catch(err => logError('Error al cargar evento', err));

      // Obtener lista de registros/asistentes al evento
      getRegistrations(id)
        .then(setAttendees)
        .catch(err => logError('Error al obtener registros', err));
      
      // Verificar si el usuario actual ya está registrado
      if (user?.uid) {
        isUserRegistered(id, user.uid)
          .then(setIsRegistered)
          .catch(err => logError('Error al verificar registro del usuario', err));
      }
    }
  }, [id, user?.uid]);

  // Función para manejar la inscripción de usuario al evento
  const handleRegister = async () => {
    if (!user) {
      alert('Debes iniciar sesión para registrarte.');
      return;
    }

    // Comprobar que el evento no ha alcanzado su capacidad máxima
    if (attendees.length >= event.capacity) {
      alert('Este evento ha alcanzado su capacidad máxima.');
      return;
    }

    try {
       // Registrar usuario en el evento mediante el servicio
      await registerUserToEvent(id!, user);
       // Actualizar estado local de asistentes con el nuevo registro
      setAttendees([...attendees, { email: user.email, timestamp: new Date() }]);
       // Marcar que el usuario ya está registrado
      setIsRegistered(true);
      logInfo('Usuario registrado en evento', { eventId: id, user });
      alert('¡Te has registrado con éxito!');
    } catch (err) {
      logError('Error al registrar usuario en evento', err);
      alert('Ocurrió un error. Intenta de nuevo.');
    }
  };

  // Mostrar mensaje mientras se carga el evento
  if (!event) {
    return <div className="p-6 text-center text-gray-500">{t('event.loading')}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">{event.title}</h1>
      <p className="text-sm text-gray-600">{event.date}</p>

      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full max-h-64 object-cover rounded-lg mt-4 mb-6"
        />
      )}

      <p className="mb-2 text-gray-700 whitespace-pre-line">{event.description}</p>
      <p className="text-sm text-gray-500 mb-1">📍 {event.location}</p>
      <p className="text-sm text-gray-500 mb-4">{t('event.category')}: {event.category}</p>
      <p className="mb-4 text-gray-700">
        <strong>{t('event.capacity')}:</strong> {event.capacity} {t('event.attendees')}<br />
        <strong>{t('event.registered')}:</strong> {attendees.length}
      </p>

      {!user ? (
        <p className="text-sm text-gray-600 italic">{t('event.loginToRegister')}</p>
      ) : isRegistered ? (
        <p className="text-green-600 font-semibold">{t('event.alreadyRegistered')}</p>
      ) : attendees.length >= event.capacity ? (
        <p className="text-red-500 font-semibold">{t('event.full')}</p>
      ) : (
        <button
          onClick={handleRegister}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          {t('event.join')}
        </button>
      )}
    </div>
  );
}
