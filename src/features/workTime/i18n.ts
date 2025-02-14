import { injectTranslation } from '~/shared/lib/i18n/i18n';

const translations = {
  ru: {
    title: 'Ваш типичный рабочий день',
    startTime: 'Начало рабочего дня',
    endTime: 'Конец рабочего дня',
  },
  en: {
    title: 'Your typical work day',
    startTime: 'Start time',
    endTime: 'End time',
  },
};

export const TRANS_NS = 'workTime';

injectTranslation(TRANS_NS, translations);
