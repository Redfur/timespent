import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '~/shared/lib/i18n/locales/en';
import ruTranslation from '~/shared/lib/i18n/locales/ru';

i18n
  .use(initReactI18next) // Инициализация react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
    },
    fallbackLng: 'ru', // Язык по умолчанию
    interpolation: {
      escapeValue: false, // React уже экранирует значения
    },
  });

export const injectTranslation = (
  namespace: string,
  translations: Record<'ru' | 'en', object>,
) => {
  if (translations.ru) {
    i18n.addResourceBundle('ru', namespace, translations.ru);
  }
  if (translations.en) {
    i18n.addResourceBundle('en', namespace, translations.en);
  }
};

export default i18n;
