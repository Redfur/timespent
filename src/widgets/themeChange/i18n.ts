import { injectTranslation } from '@/shared/lib/i18n';

const translations = {
	ru: {
		system: 'Системная тема',
		light: 'Светлая тема',
		dark: 'Темная тема',
	},
	en: {
		system: 'System theme',
		light: 'Light theme',
		dark: 'Dark theme',
	},
};

export const TRANS_NS = 'themeChange';

injectTranslation(TRANS_NS, translations);
