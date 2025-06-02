import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Cambia el idioma actual usando i18n
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

  return (
    // Botones para seleccionar el idioma, mostrando las banderas correspondientes
    <div className="flex gap-2">
      <button onClick={() => changeLanguage('es')}>🇪🇸</button>
      <button onClick={() => changeLanguage('en')}>🇬🇧</button>
    </div>
  );
}
