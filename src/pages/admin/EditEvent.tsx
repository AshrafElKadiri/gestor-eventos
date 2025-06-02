import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, updateEvent } from '../../features/events/eventService';
import { logInfo, logError } from '../../utils/logger'; // Asegúrate de tenerlo
import { useTranslation } from 'react-i18next';

type EventData = {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  capacity: number;
  location: string;
  category: string;
};

export default function EditEvent() {
  /* Extraemos el id del evento desde la URL */
  const { id } = useParams();
  const navigate = useNavigate(); 
  const { t } = useTranslation();

  /* Estados para almacenar los valores del formulario */
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  /* Efecto que carga el evento al montar o cuando cambia el id */
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return; // Si no hay id, no hacemos nada

      try {
        /* Obtenemos los datos del evento */
        const data = await getEventById(id);
        if (data) {
          const eventData = data as EventData;

          /* Seteamos los estados con los datos recibidos */
          setTitle(eventData.title);
          setDate(eventData.date);
          setDescription(eventData.description);
          setImageUrl(eventData.imageUrl);
          setCapacity(eventData.capacity);
          setLocation(eventData.location);
          setCategory(eventData.category);

          logInfo('Evento cargado para editar', eventData);
        }
      } catch (err) {
        /* Logueamos error en caso de fallo */
        logError('Error al cargar evento para editar', err);
      }
    };

    loadEvent();
  }, [id]);

  /* Función que maneja la actualización del evento */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    /* Construimos el objeto con los datos a actualizar */
    const updatedEvent = { title, date, description, imageUrl, capacity, location, category };

    try {
      /* Actualizamos el evento */
      await updateEvent(id, updatedEvent);
      logInfo('Evento actualizado', { id, ...updatedEvent });

      /* Navegamos de vuelta al panel admin */
      navigate('/gestor-eventos/admin');
    } catch (err) {
      logError('Error al actualizar evento', err);
      alert('No se pudo actualizar el evento.');
    }
  };


 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleUpdate}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {t('eventEdit.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t('eventCreate.fields.title')}
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="date"
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder={t('eventCreate.fields.location')}
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">{t('eventCreate.fields.selectCategory')}</option>
            <option value="música">🎵 {t('categories.music')}</option>
            <option value="tecnología">💻 {t('categories.tech')}</option>
            <option value="arte">🎨 {t('categories.art')}</option>
            <option value="deporte">🏅 {t('categories.sports')}</option>
          </select>

          <input
            type="url"
            placeholder={t('eventCreate.fields.imageUrl')}
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <input
            type="number"
            placeholder={t('eventCreate.fields.capacity')}
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </div>

        <textarea
          placeholder={t('eventCreate.fields.description')}
          className="w-full mt-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <button
          type="submit"
          className="w-full mt-6 bg-yellow-500 text-white py-3 rounded font-semibold hover:bg-yellow-600 transition"
        >
          {t('eventEdit.save')}
        </button>
      </form>
    </div>
  );
}