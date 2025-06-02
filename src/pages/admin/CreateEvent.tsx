/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { createEvent } from '../../features/events/eventService';
import { useNavigate } from 'react-router-dom';
import { logError, logInfo } from '../../utils/logger';
import { useTranslation } from 'react-i18next';

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [capacity, setCapacity] = useState(0);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = {
      title,
      date,
      description,
      imageUrl,
      capacity,
      location,
      category,
    };

    try {
      logInfo('Intentando crear evento', newEvent);
      await createEvent(newEvent);
      logInfo('Evento creado exitosamente', { title, date });
      navigate('/gestor-eventos/admin');
    } catch (error: any) {
      logError('Error al crear evento', { message: error.message, error });
      alert(t('eventCreate.error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {t('eventCreate.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder={t('eventCreate.fields.title')}
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="date"
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder={t('eventCreate.fields.location')}
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <input
            type="number"
            placeholder={t('eventCreate.fields.capacity')}
            className="p-3 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </div>

        <textarea
          placeholder={t('eventCreate.fields.description')}
          className="w-full mt-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          {t('eventCreate.save')}
        </button>
      </form>
    </div>
  );
}
