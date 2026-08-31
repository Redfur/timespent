import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Typography } from '@/shared/ui/typography';
import { TRANS_NS } from '../i18n';
import { useGroupsStore } from '../store/groupsStore';
import type { WorkTimeSettings } from '../store/settingsStore';
import type { SpentBy } from '../types';
import { WorkDayCalendar } from './WorkDayCalendar';
import { WorkDaySummary } from './WorkDaySummary';

interface WorkDayProgressProps {
	salary: number;
	workTime: WorkTimeSettings;
	workHours: number;
}

export interface ExpenseSegment {
	groupName: string;
	color: string;
	percentage: number;
	amount: number;
	hours: number;
	formattedTime: string;
	// Сегмент накоплений/свободного времени рендерится нейтральным цветом темы, а не своим "color"
	isSavings?: boolean;
}

// Константы
export const WORK_DAYS_PER_MONTH = 22;
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;

// Утилиты для расчета времени
export const formatTime = (hours: number, t: (key: string) => string): string => {
	const dailyHours = hours / WORK_DAYS_PER_MONTH;
	const totalMinutes = Math.round(dailyHours * 60);
	const wholeHours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;
	const h = t('progress.hoursShort');
	const m = t('progress.minutesShort');

	if (wholeHours === 0) {
		return `${minutes} ${m}`;
	}
	if (minutes === 0) {
		return `${wholeHours} ${h}`;
	}
	return `${wholeHours} ${h} ${minutes} ${m}`;
};

const calculateMonthlyAmount = (spent: number, spentBy: SpentBy): number => {
	switch (spentBy) {
		case 'day':
			return spent * DAYS_PER_MONTH;
		case 'month':
			return spent;
		case 'year':
			return spent / MONTHS_PER_YEAR;
		default:
			return 0;
	}
};

// Хук для расчета месячных расходов
const useMonthlyExpenses = () => {
	const { groups } = useGroupsStore();

	return useMemo(() => {
		const monthlyExpenses: Record<string, { amount: number; color: string }> = {};

		for (const group of groups) {
			const groupTotal = group.items.reduce((total, item) => {
				return total + calculateMonthlyAmount(item.spent, item.spentBy);
			}, 0);

			if (groupTotal > 0) {
				monthlyExpenses[group.name] = { amount: groupTotal, color: group.color };
			}
		}

		return monthlyExpenses;
	}, [groups]);
};

// Хук для расчета сегментов прогресс-бара
const useExpenseSegments = (
	monthlyExpenses: Record<string, { amount: number; color: string }>,
	salary: number,
	workHours: number,
) => {
	const { t } = useTranslation(TRANS_NS);

	return useMemo(() => {
		const totalMonthlyExpenses = Object.values(monthlyExpenses).reduce((sum, expense) => sum + expense.amount, 0);

		if (totalMonthlyExpenses === 0) return [];

		const hourlyRate = salary / (workHours * WORK_DAYS_PER_MONTH);
		const segments: ExpenseSegment[] = [];

		// Добавляем сегменты расходов
		for (const [groupName, expense] of Object.entries(monthlyExpenses)) {
			const percentageOfSalary = (expense.amount / salary) * 100;
			const hours = expense.amount / hourlyRate;

			segments.push({
				groupName,
				color: expense.color,
				percentage: percentageOfSalary,
				amount: expense.amount,
				hours,
				formattedTime: formatTime(hours, t),
			});
		}

		// Сортируем по убыванию процента
		segments.sort((a, b) => b.percentage - a.percentage);

		// Добавляем сегмент накоплений, если есть свободные средства
		if (totalMonthlyExpenses < salary) {
			const savingsAmount = salary - totalMonthlyExpenses;
			const savingsHours = savingsAmount / hourlyRate;

			segments.push({
				groupName: t('progress.savingsSegment'),
				color: '',
				isSavings: true,
				percentage: (savingsAmount / salary) * 100,
				amount: savingsAmount,
				hours: savingsHours,
				formattedTime: formatTime(savingsHours, t),
			});
		}

		return segments;
	}, [monthlyExpenses, salary, workHours, t]);
};

export const WorkDayProgress = ({ salary, workTime, workHours }: WorkDayProgressProps) => {
	const { t } = useTranslation(TRANS_NS);

	const monthlyExpenses = useMonthlyExpenses();
	const segments = useExpenseSegments(monthlyExpenses, salary, workHours);
	const totalMonthlyExpenses = Object.values(monthlyExpenses).reduce((sum, expense) => sum + expense.amount, 0);

	if (segments.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>{t('progress.title')}</CardTitle>
				</CardHeader>
				<CardContent>
					<Typography variant="body2" color="secondary">
						{t('progress.noExpenses')}
					</Typography>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>{t('progress.title')}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="relative">
						<WorkDayCalendar segments={segments} workTime={workTime} />

						<Typography variant="caption" color="secondary" className="mt-1 block">
							{t('progress.totalHours', { hours: workHours })}
							{/* {t('progress.salary', { amount: salary.toLocaleString() })} */}
						</Typography>
					</div>
				</CardContent>
			</Card>
			<WorkDaySummary segments={segments} salary={salary} totalMonthlyExpenses={totalMonthlyExpenses} />
		</>
	);
};
