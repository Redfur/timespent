import { Box, Card, CardContent, CardHeader, Typography, useTheme } from '@mui/material';
import type { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TRANS_NS } from '../i18n';
import { useGroupsStore } from '../store/groupsStore';
import type { SpentBy } from '../types';

interface WorkDayProgressProps {
	salary: number;
	workTime: {
		startTime: Dayjs;
		endTime: Dayjs;
		lunchStartTime: Dayjs;
		lunchEndTime: Dayjs;
		includeLunch: boolean;
	};
	workHours: number;
}

interface ExpenseSegment {
	groupName: string;
	color: string;
	percentage: number;
	amount: number;
	hours: number;
	formattedTime: string;
}

// Константы
const WORK_DAYS_PER_MONTH = 22;
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
	const theme = useTheme();

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
				groupName: 'Накопления',
				color: theme.palette.mode === 'dark' ? '#222' : '#f0f0f0',
				percentage: (savingsAmount / salary) * 100,
				amount: savingsAmount,
				hours: savingsHours,
				formattedTime: formatTime(savingsHours),
			});
		}

		return segments;
	}, [monthlyExpenses, salary, workHours, theme.palette.mode]);
};

// Компонент для отображения часов
const TimeLabels = ({ workHours, startTime }: { workHours: number; startTime: Dayjs }) => {
	const theme = useTheme();

	return (
		<Box>
			{Array.from({ length: Math.ceil(workHours) + 2 }, (_, i) => {
				const hour = startTime.hour() + i;
				return (
					<Box
						key={hour}
						sx={{
							height: '40px',
							fontSize: '12px',
							fontWeight: 'bold',
							color: theme.palette.text.secondary,
						}}
					>
						{hour}:00
					</Box>
				);
			})}
		</Box>
	);
};

// Компонент для отображения сегментов
const ProgressSegments = ({ segments }: { segments: ExpenseSegment[] }) => {
	return (
		<Box
			sx={{
				position: 'relative',
				height: '100%',
				width: '100%',
				fontSize: '12px',
				borderRadius: 2,
				overflow: 'hidden',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{segments.map(segment => (
				<Box
					key={segment.groupName}
					sx={{
						height: `${segment.percentage}%`,
						flex: '0 0 auto',
						backgroundColor: segment.color,
						color: '#fff',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						padding: 1,
						position: 'relative',
						cursor: 'pointer',
						'&:hover': {
							zIndex: 1,
							minHeight: '32px',
						},
					}}
				>
					<Box>{segment.groupName}</Box>
					<Box>{segment.formattedTime}</Box>
				</Box>
			))}
		</Box>
	);
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
	const theme = useTheme();

	const hourlyRate = salary / (workHours * WORK_DAYS_PER_MONTH);
	const workTimeForExpenses = totalMonthlyExpenses / hourlyRate;
	const savingsAmount = salary - totalMonthlyExpenses;
	const savingsHours = savingsAmount / hourlyRate;

	return (
		<Box sx={{ mt: 3, p: 2, backgroundColor: theme.palette.action.hover, borderRadius: 1 }}>
			<Typography variant="body2" gutterBottom>
				<strong>{t('progress.summary')}</strong>
			</Typography>
			<Typography variant="body2" color="text.secondary">
				{t('progress.monthlyExpenses', { amount: totalMonthlyExpenses.toLocaleString() })}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				{t('progress.expensesPercentage', {
					percentage: ((totalMonthlyExpenses / salary) * 100).toFixed(1),
				})}
			</Typography>
			<Typography variant="body2" color="text.secondary">
				{t('progress.workTimeForExpenses', {
					hours: workTimeForExpenses.toFixed(1),
				})}
			</Typography>
			{totalMonthlyExpenses < salary && (
				<Typography variant="body2" color="success.main">
					{t('progress.savings', {
						amount: savingsAmount.toLocaleString(),
						hours: savingsHours.toFixed(1),
					})}
				</Typography>
			)}
		</Box>
	);
};

export const WorkDayProgress = ({ salary, workTime, workHours }: WorkDayProgressProps) => {
	const { t } = useTranslation(TRANS_NS);
	const theme = useTheme();

	const monthlyExpenses = useMonthlyExpenses();
	const segments = useExpenseSegments(monthlyExpenses, salary, workHours);
	const totalMonthlyExpenses = Object.values(monthlyExpenses).reduce((sum, expense) => sum + expense.amount, 0);

	if (segments.length === 0) {
		return (
			<Card>
				<CardHeader title={t('progress.title')} />
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						{t('progress.noExpenses')}
					</Typography>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader title={t('progress.title')} />
			<CardContent>
				<Box sx={{ mb: 3, position: 'relative' }}>
					<Typography variant="h6" gutterBottom>
						{t('progress.workDay')}
					</Typography>

					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: 'auto 1fr',
							gap: '12px',
							position: 'relative',
							backgroundColor: theme.palette.background.paper,
							borderRadius: 2,
							overflow: 'hidden',
							padding: '12px',
							boxShadow: 2,
						}}
					>
						<TimeLabels workHours={workHours} startTime={workTime.startTime} />
						<ProgressSegments segments={segments} />
					</Box>

					<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
						{t('progress.totalHours', { hours: workHours })} •{' '}
						{t('progress.salary', { amount: salary.toLocaleString() })}
					</Typography>
				</Box>

				<SummarySection salary={salary} totalMonthlyExpenses={totalMonthlyExpenses} workHours={workHours} />
			</CardContent>
		</Card>
	);
};
