import { injectTranslation } from '~/shared/lib/i18n';

const translations = {
	ru: {
		label: 'Язык',
	},
	en: {
		label: 'Language',
	},
};

export const TRANS_NS = 'languageChange';

injectTranslation(TRANS_NS, translations);
