import { injectTranslation } from '~/shared/lib/i18n';

const translations = {
  ru: {
    title: 'Настройки',
  },
  en: {
    title: 'Settings',
  },
};

export const TRANS_NS = 'settingsSidebar';

injectTranslation(TRANS_NS, translations);
