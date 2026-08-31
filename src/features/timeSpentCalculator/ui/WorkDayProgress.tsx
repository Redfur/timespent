import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Typography } from '@/shared/ui/typography';
import { TRANS_NS } from '../i18n';
import { useGroupsStore } from '../store/groupsStore';
import type { WorkTimeSettings } from '../store/settingsStore';
import type { SpentBy } from '../types';
import { WorkDayCalendar } from './WorkDayCalendar';

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
}

// Константы
export const WORK_DAYS_PER_MONTH = 22;
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;

// Утилиты для расчета времени
const formatTime = (hours: number): string => {
	const dailyHours = hours / WORK_DAYS_PER_MONTH;
	const wholeHours = Math.floor(dailyHours);
	const minutes = Math.round((dailyHours - wholeHours) * 60);

	if (wholeHours === 0) {
		return `${minutes} мин`;
	}
	if (minutes === 0) {
		return `${wholeHours} ч`;
	}
	return `${wholeHours} ч ${minutes} мин`;
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
	const { theme } = useTheme();
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
				formattedTime: formatTime(hours),
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
				color: theme === 'dark' ? '#222' : '#666',
				percentage: (savingsAmount / salary) * 100,
				amount: savingsAmount,
				hours: savingsHours,
				formattedTime: formatTime(savingsHours),
			});
		}

		return segments;
	}, [monthlyExpenses, salary, workHours, theme, t]);
};

// Компонент для отображения сводки
const SummarySection = ({
	salary,
	totalMonthlyExpenses,
	workHours,
}: {
	salary: number;
	totalMonthlyExpenses: number;
	workHours: number;
}) => {
	const { t } = useTranslation(TRANS_NS);

	const hourlyRate = salary / (workHours * WORK_DAYS_PER_MONTH);
	const workTimeForExpenses = totalMonthlyExpenses / hourlyRate;
	const savingsAmount = salary - totalMonthlyExpenses;
	const savingsHours = savingsAmount / hourlyRate;

	// TODO: переделать на Card
	return (
		<Card className="gap-2">
			<CardHeader>
				<CardTitle>{t('progress.summary')}</CardTitle>
			</CardHeader>
			<CardContent>
				<Typography variant="body2" color="secondary">
					{t('progress.monthlyExpenses', { amount: totalMonthlyExpenses.toLocaleString() })}
				</Typography>
				<Typography variant="body2" color="secondary">
					{t('progress.expensesPercentage', {
						percentage: ((totalMonthlyExpenses / salary) * 100).toFixed(1),
					})}
				</Typography>
				<Typography variant="body2" color="secondary">
					{t('progress.workTimeForExpenses', {
						hours: workTimeForExpenses.toFixed(1),
					})}
				</Typography>
				{totalMonthlyExpenses < salary && (
					<Typography variant="body2" color="success">
						{t('progress.savings', {
							amount: savingsAmount.toLocaleString(),
							hours: savingsHours.toFixed(1),
						})}
					</Typography>
				)}
			</CardContent>
		</Card>
	);
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
			<SummarySection salary={salary} totalMonthlyExpenses={totalMonthlyExpenses} workHours={workHours} />
		</>
	);
};
