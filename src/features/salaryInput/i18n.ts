import { injectTranslation } from '~/shared/lib/i18n/i18n';

const translations = {
  ru: {
    title: 'Зарплата на руки',
    rubles_a_month_one: 'рубль в месяц',
    rubles_a_month_few: 'рубля в месяц',
    rubles_a_month_many: 'рублей в месяц',
    description:
      'Если у вас нестабильный оклад, укажите среднемесячную зарплату за последние полгода.',
  },
  en: {
    title: 'Salary after tax',
    rubles_a_month_one: 'ruble in a month',
    rubles_a_month_other: 'rubles in a month',
    description:
      'If your salary is not stable, please enter your average salary for the last 6 months.',
  },
};

export const TRANS_NS = 'salaryInput';

injectTranslation(TRANS_NS, translations);
