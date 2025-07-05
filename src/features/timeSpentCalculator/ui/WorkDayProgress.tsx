import { Box, Card, CardContent, CardHeader, Typography, useTheme } from '@mui/material';
import type { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { TRANS_NS } from '../i18n';
import { useGroupsStore } from '../store/groupsStore';

interface WorkDayProgressProps {
	salary: number;
	workHours: number;
	startTime: Dayjs;
}

interface ExpenseSegment {
	groupName: string;
	color: string;
	percentage: number;
	amount: number;
	hours: number;
	formattedTime: string;
}

export const WorkDayProgress = ({ salary, workHours, startTime }: WorkDayProgressProps) => {
	const { t } = useTranslation(TRANS_NS);
	const { groups } = useGroupsStore();
	const theme = useTheme();

	// Рассчитываем месячные расходы по группам
	const calculateMonthlyExpenses = () => {
		const monthlyExpenses: Record<string, { amount: number; color: string }> = {};

		for (const group of groups) {
			let groupTotal = 0;
			for (const item of group.items) {
				let monthlyAmount = 0;
				switch (item.spentBy) {
					case 'day':
						monthlyAmount = item.spent * 30; // 30 дней в месяц
						break;
					case 'month':
						monthlyAmount = item.spent;
						break;
					case 'year':
						monthlyAmount = item.spent / 12; // делим годовой расход на 12 месяцев
						break;
				}
				groupTotal += monthlyAmount;
			}
			monthlyExpenses[group.name] = { amount: groupTotal, color: group.color };
		}

		return monthlyExpenses;
	};

	const monthlyExpenses = calculateMonthlyExpenses();
	const totalMonthlyExpenses = Object.values(monthlyExpenses).reduce((sum, expense) => sum + expense.amount, 0);

	// Рассчитываем сегменты для прогресс-бара
	const calculateSegments = (): ExpenseSegment[] => {
		if (totalMonthlyExpenses === 0) return [];

		const segments: ExpenseSegment[] = [];
		const hourlyRate = salary / (workHours * 22); // 22 рабочих дня в месяц

		// Рассчитываем процент от зарплаты, а не от общих расходов
		for (const [groupName, expense] of Object.entries(monthlyExpenses)) {
			if (expense.amount > 0) {
				const percentageOfSalary = (expense.amount / salary) * 100;
				const hours = expense.amount / hourlyRate;
				segments.push({
					groupName,
					color: expense.color,
					percentage: percentageOfSalary, // Процент от зарплаты
					amount: expense.amount,
					hours,
					formattedTime: (() => {
						// Конвертируем месячные часы в дневные
						const dailyHours = hours / 22; // 22 рабочих дня в месяц
						const wholeHours = Math.floor(dailyHours);
						const minutes = Math.round((dailyHours - wholeHours) * 60);

						if (wholeHours === 0) {
							return `${minutes} мин`;
						}
						if (minutes === 0) {
							return `${wholeHours} ч`;
						}
						return `${wholeHours} ч ${minutes} мин`;
					})(),
				});
			}
		}

		return segments.sort((a, b) => b.percentage - a.percentage);
	};

	const segments = calculateSegments();

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
						<Box
							sx={{
								position: 'relative',
								height: '100%',
								width: '100%',
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
										padding: 1,
										position: 'relative',
										cursor: 'pointer',
										'&:hover': {
											zIndex: 1,
											minHeight: '40px',
										},
									}}
								>
									<Box>{segment.groupName}</Box>
									<Box>{segment.formattedTime}</Box>
								</Box>
							))}
							{totalMonthlyExpenses < salary ? (
								<Box
									sx={{
										flex: '1 1 auto',
										backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#f0f0f0',
										padding: 1,
										position: 'relative',
										cursor: 'pointer',
										'&:hover': {
											zIndex: 1,
										},
									}}
								>
									Накопления
								</Box>
							) : null}
						</Box>
					</Box>

					<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
						{t('progress.totalHours', { hours: workHours })} •{' '}
						{t('progress.salary', { amount: salary.toLocaleString() })}
					</Typography>
				</Box>

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
							hours: (totalMonthlyExpenses / (salary / (workHours * 22))).toFixed(1),
						})}
					</Typography>
					{totalMonthlyExpenses < salary && (
						<Typography variant="body2" color="success.main">
							{t('progress.savings', {
								amount: (salary - totalMonthlyExpenses).toLocaleString(),
								hours: ((salary - totalMonthlyExpenses) / (salary / (workHours * 22))).toFixed(1),
							})}
						</Typography>
					)}
				</Box>
			</CardContent>
		</Card>
	);
};
