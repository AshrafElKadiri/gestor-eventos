/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRegistrations } from '../../features/events/eventService';
import { useTranslation } from 'react-i18next';

export default function EventAttendees() {
  // Obtenemos el id del evento desde los parámetros de la URL
  const { id } = useParams();
   // Estado para guardar la lista de asistentes
  const [attendees, setAttendees] = useState<any[]>([]);

  const { t } = useTranslation();

  // useEffect para cargar los asistentes cuando cambie el id
  useEffect(() => {
    if (id) {
       // Llamamos al servicio que trae los registros y guardamos en estado
      getRegistrations(id).then(setAttendees);
    }
  }, [id]);

  // Función para exportar la lista de asistentes a un archivo CSV
  const exportToCSV = () => {
    const rows = [
      ['Email', 'Fecha de registro'],
      ...attendees.map((a) => [
        a.email,
        new Date(a.timestamp?.seconds * 1000).toLocaleString(),
      ]),
    ];
    
    // Construimos el contenido CSV
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.join(',')).join('\n');

    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `inscritos_evento_${id}.csv`;
    link.click();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{t('attendees.title')}</h2>

      {attendees.length === 0 ? (
        <p>{t('attendees.noRecords')}</p>
      ) : (
        <>
          <button
            onClick={exportToCSV}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t('attendees.export')}
          </button>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2 text-left">
                    {t('attendees.email')}
                  </th>
                  <th className="border px-4 py-2 text-left">
                    {t('attendees.date')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="border px-4 py-2">{a.email}</td>
                    <td className="border px-4 py-2">
                      {new Date(a.timestamp?.seconds * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}