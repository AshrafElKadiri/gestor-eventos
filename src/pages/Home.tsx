/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { getEvents } from '../features/events/eventService';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const [events, setEvents] = useState<any[]>([]); // Estado para almacenar todos los eventos obtenidos desde el backend
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]); // Estado para eventos filtrados y ordenados según los filtros aplicados
  const [search, setSearch] = useState(''); // Estado para el filtro de búsqueda por nombre
  const [dateFrom, setDateFrom] = useState(''); // Estado para filtro de fecha inicio
  const [dateTo, setDateTo] = useState(''); // Estado para filtro de fecha fin
  const [orderBy, setOrderBy] = useState<'title' | 'date'>('date'); // Estado para definir el campo por el que ordenar (nombre o fecha)
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc'); // Estado para definir la dirección de la ordenación (ascendente o descendente)
  const [categoryFilter, setCategoryFilter] = useState('');  // Estado para filtrar por categoría

  const { t } = useTranslation();
  
  // Para cargar los eventos al montar el componente
  useEffect(() => {
    getEvents().then((data) => {
      // Guardamos los eventos originales y también en el estado filtrado inicialmente igual
      setEvents(data);
      setFilteredEvents(data);
    });
  }, []);

    // Efecto que se ejecuta cada vez que cambian los filtros o la lista de eventos
  useEffect(() => {
    // Filtramos los eventos según el texto de búsqueda, rango de fechas y categoría
    let filtered = events.filter((event) => {
      const matchesTitle = event.title.toLowerCase().includes(search.toLowerCase());
      const eventDate = new Date(event.date);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      // Comprobamos que la fecha del evento esté dentro del rango si se especifica
      const matchesRange =
        (!fromDate || eventDate >= fromDate) &&
        (!toDate || eventDate <= toDate);

      // Si se selecciona categoría, filtramos por ella, sino aceptamos todas
      const matchesCategory = categoryFilter ? event.category === categoryFilter : true;

      // El evento debe cumplir todas las condiciones para incluirse
      return matchesTitle && matchesRange && matchesCategory;
    });

    // Ordenamos los eventos filtrados según el campo y dirección seleccionados
    filtered = filtered.sort((a, b) => {
      // Se intenta llamar a toLowerCase para strings, si no existe se ordena por valor directo
      const aVal = a[orderBy].toLowerCase?.() || a[orderBy];
      const bVal = b[orderBy].toLowerCase?.() || b[orderBy];
      if (aVal < bVal) return orderDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return orderDirection === 'asc' ? 1 : -1;
      return 0;
    });

    // Actualizamos el estado con los eventos ya filtrados y ordenados
    setFilteredEvents(filtered);
  }, [search, dateFrom, dateTo, categoryFilter, orderBy, orderDirection, events]);

  // Función para resetear todos los filtros a su estado inicial
  const resetFilters = () => {
    setSearch('');
    setDateFrom('');
    setDateTo('');
    setCategoryFilter('');
    setOrderBy('date');
    setOrderDirection('asc');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{t('home.availableEvents')}</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4 bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('home.filters')}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('home.searchLabel')}</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder={t('home.palaceholderFind')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('home.dateFrom')}</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('home.dateTo')}</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('home.category')}</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">{t('home.category.all')}</option>
              <option value="música">{t('home.category.music')}</option>
              <option value="tecnología">{t('home.category.tech')}</option>
              <option value="arte">{t('home.category.art')}</option>
              <option value="deporte">{t('home.category.sport')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('home.sortBy')}</label>
            <select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value as 'title' | 'date')}
              className="w-full p-2 border rounded"
            >
              <option value="title">{t('home.sortBy.title')}</option>
              <option value="date">{t('home.sortBy.date')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t('home.sortDirection')}</label>
            <select
              value={orderDirection}
              onChange={(e) => setOrderDirection(e.target.value as 'asc' | 'desc')}
              className="w-full p-2 border rounded"
            >
              <option value="asc">{t('home.sortDirection.asc')}</option>
              <option value="desc">{t('home.sortDirection.desc')}</option>
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded"
          >
            {t('home.resetFilters')}
          </button>
        </aside>

        <section className="flex-1">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-gray-500">{t('home.noEventsFound')}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
                >
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                    <p className="text-sm text-gray-500">{event.date}</p>
                    <p className="text-gray-700 mt-2 flex-1">
                      {event.description?.slice(0, 100)}...
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {t('home.event.locationAndCategory', {
                        location: event.location,
                        category: event.category
                      })}
                    </p>
                    <Link
                      to={`/gestor-eventos/event/${event.id}`}
                      className="mt-4 inline-block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                      {t('home.viewDetails')}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
