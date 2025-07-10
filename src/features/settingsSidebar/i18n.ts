import { injectTranslation } from '@/shared/lib/i18n';

const translations = {
	ru: {
		title: 'Настройки',
		theme: 'Тема',
		language: 'Язык',
	},
	en: {
		title: 'Settings',
		theme: 'Theme',
		language: 'Language',
	},
};

export const TRANS_NS = 'settingsSidebar';

injectTranslation(TRANS_NS, translations);
