import { injectTranslation } from '~/shared/lib/i18n';

const translations = {
	ru: {
		workTimeInput: {
			title: 'Ваш типичный рабочий день',
			startTime: 'Начало рабочего дня',
			endTime: 'Конец рабочего дня',
		},
		salaryInput: {
			title: 'Зарплата на руки',
			rubles_a_month_one: 'рубль в месяц',
			rubles_a_month_few: 'рубля в месяц',
			rubles_a_month_many: 'рублей в месяц',
			description: 'Если у вас нестабильный оклад, укажите среднемесячную зарплату за последние полгода.',
		},
		periods: {
			label: 'Период',
			day: 'в день',
			month: 'в месяц',
			year: 'в год',
		},
		addGroup: {
			button: 'Добавить группу',
			title: 'Новая группа расходов',
			name: 'Название группы',
			description: 'Описание (необязательно)',
			color: 'Цвет группы',
			add: 'Добавить',
		},
		deleteGroup: {
			button: 'Удалить группу',
			confirmTitle: 'Удалить группу?',
			confirmMessage: 'Вы уверены, что хотите удалить группу "{{name}}"? Это действие нельзя отменить.',
			confirm: 'Удалить',
			cancel: 'Отмена',
		},
		progress: {
			title: 'Ваш рабочий день',
			workDay: 'Рабочий день',
			breakdown: 'Разбивка по группам',
			summary: 'Итого',
			noExpenses: 'Добавьте расходы, чтобы увидеть результаты',
			totalHours: 'Всего часов: {{hours}}',
			salary: 'Зарплата: {{amount}} ₽',
			monthlyExpenses: 'Месячные расходы: {{amount}} ₽',
			expensesPercentage: 'Расходы составляют {{percentage}}% от зарплаты',
			workTimeForExpenses: 'Время работы на расходы: {{hours}}ч',
			savings: 'Свободные средства: {{amount}} ₽ ({{hours}}ч работы)',
		},
		common: {
			cancel: 'Отмена',
		},
	},
	en: {
		workTimeInput: {
			title: 'Your typical work day',
			startTime: 'Start time',
			endTime: 'End time',
		},
		salaryInput: {
			title: 'Salary after tax',
			rubles_a_month_one: 'ruble in a month',
			rubles_a_month_other: 'rubles in a month',
			description: 'If your salary is not stable, please enter your average salary for the last 6 months.',
		},
		periods: {
			label: 'Period',
			day: 'per day',
			month: 'per month',
			year: 'per year',
		},
		addGroup: {
			button: 'Add group',
			title: 'New expense group',
			name: 'Group name',
			description: 'Description (optional)',
			color: 'Group color',
			add: 'Add',
		},
		deleteGroup: {
			button: 'Delete group',
			confirmTitle: 'Delete group?',
			confirmMessage: 'Are you sure you want to delete the group "{{name}}"? This action cannot be undone.',
			confirm: 'Delete',
			cancel: 'Cancel',
		},
		progress: {
			title: 'Your work day',
			workDay: 'Work day',
			breakdown: 'Breakdown by groups',
			summary: 'Summary',
			noExpenses: 'Add expenses to see results',
			totalHours: 'Total hours: {{hours}}',
			salary: 'Salary: {{amount}} ₽',
			monthlyExpenses: 'Monthly expenses: {{amount}} ₽',
			expensesPercentage: 'Expenses are {{percentage}}% of salary',
			workTimeForExpenses: 'Work time for expenses: {{hours}}h',
			savings: 'Free funds: {{amount}} ₽ ({{hours}}h of work)',
		},
		common: {
			cancel: 'Cancel',
		},
	},
};

export const TRANS_NS = 'timeSpentCalculator';

injectTranslation(TRANS_NS, translations);
