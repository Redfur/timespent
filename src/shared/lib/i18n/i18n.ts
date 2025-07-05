import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '~/shared/lib/i18n/locales/en';
import ruTranslation from '~/shared/lib/i18n/locales/ru';

const LANGUAGE_STORAGE_KEY = 'timespent-language';

// Получаем сохраненный язык или используем русский по умолчанию
const getInitialLanguage = () => {
	if (typeof window !== 'undefined') {
		const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
		if (savedLanguage && ['ru', 'en'].includes(savedLanguage)) {
			return savedLanguage;
		}
	}
	return 'ru';
};

i18n
	.use(initReactI18next) // Инициализация react-i18next
	.init({
		defaultNS: 'common',
		lng: getInitialLanguage(), // Используем сохраненный язык
		fallbackLng: 'ru', // Язык по умолчанию
		interpolation: {
			escapeValue: false, // React уже экранирует значения
		},
	});

i18n.addResourceBundle('ru', 'common', ruTranslation);
i18n.addResourceBundle('en', 'common', enTranslation);

export const injectTranslation = (namespace: string, translations: Record<'ru' | 'en', object>) => {
	if (translations.ru) {
		i18n.addResourceBundle('ru', namespace, translations.ru);
	}
	if (translations.en) {
		i18n.addResourceBundle('en', namespace, translations.en);
	}
};

export { LANGUAGE_STORAGE_KEY };
export default i18n;
