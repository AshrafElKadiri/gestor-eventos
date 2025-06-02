import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './es.json';
import en from './en.json';

// Inicializo i18next con configuración personalizada
i18n
  .use(initReactI18next) // Conecto i18next con React a través del plugin oficial
  .init({
    // Defino los recursos de traducción disponibles (idiomas y su contenido)
    resources: {
      es: { translation: es }, // Traducciones en español
      en: { translation: en }, // Traducciones en inglés
    },
    lng: 'es',          // Idioma predeterminado de la aplicación
    fallbackLng: 'es',  // Idioma de respaldo en caso de que no se detecte o falle alguno
    interpolation: {
      escapeValue: false, // Desactivo el escape de valores porque React ya lo hace automáticamente
    },
  });

export default i18n;
