import { injectTranslation } from '~/shared/lib/i18n/i18n';

const translations = {
  ru: {
    title: 'Время работы',
  },
  en: {
    title: 'Work time',
  },
};

export const TRANS_KEY = 'workTime';

injectTranslation(TRANS_KEY, translations);
