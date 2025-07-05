import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TRANS_NS } from '../i18n';
import { useGroupsStore } from '../store/groupsStore';

interface WorkDayProgressProps {
	salary: number;
	workHours: number;
}

interface ExpenseSegment {
	groupName: string;
	color: string;
	percentage: number;
	amount: number;
	hours: number;
}

export const WorkDayProgress = ({ salary, workHours }: WorkDayProgressProps) => {
	const { t } = useTranslation(TRANS_NS);
	const { groups } = useGroupsStore();

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
				<Box sx={{ mb: 3 }}>
					<Typography variant="h6" gutterBottom>
						{t('progress.workDay')}
					</Typography>
					<Box
						sx={{
							height: 40,
							borderRadius: 2,
							overflow: 'hidden',
							display: 'flex',
							border: '1px solid #e0e0e0',
							position: 'relative',
						}}
					>
						{/* Сегменты расходов */}
						{segments.map(segment => (
							<Box
								key={segment.groupName}
								sx={{
									width: `${segment.percentage}%`,
									backgroundColor: segment.color,
									position: 'relative',
									'&:hover': {
										opacity: 0.8,
									},
								}}
								title={`${segment.groupName}: ${segment.hours.toFixed(1)}ч (${segment.percentage.toFixed(1)}% от зарплаты)`}
							/>
						))}
						{/* Свободное место (если расходы меньше зарплаты) */}
						{totalMonthlyExpenses < salary && (
							<Box
								sx={{
									width: `${((salary - totalMonthlyExpenses) / salary) * 100}%`,
									backgroundColor: '#000000',
									position: 'relative',
								}}
								title={`Свободные средства: ${(salary - totalMonthlyExpenses).toLocaleString()} ₽`}
							/>
						)}
					</Box>
					<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
						{t('progress.totalHours', { hours: workHours })} •{' '}
						{t('progress.salary', { amount: salary.toLocaleString() })}
					</Typography>
				</Box>

				<Box>
					<Typography variant="h6" gutterBottom>
						{t('progress.breakdown')}
					</Typography>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
						{segments.map(segment => (
							<Box key={segment.groupName} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box
									sx={{
										width: 16,
										height: 16,
										backgroundColor: segment.color,
										borderRadius: '50%',
									}}
								/>
								<Typography variant="body2" sx={{ flex: 1 }}>
									{segment.groupName}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{segment.hours.toFixed(1)}ч
								</Typography>
								<Typography variant="body2" color="text.secondary">
									({segment.percentage.toFixed(1)}% от зарплаты)
								</Typography>
							</Box>
						))}
						{/* Показываем свободные средства, если они есть */}
						{totalMonthlyExpenses < salary && (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<Box
									sx={{
										width: 16,
										height: 16,
										backgroundColor: '#000000',
										borderRadius: '50%',
									}}
								/>
								<Typography variant="body2" sx={{ flex: 1 }}>
									Свободные средства
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{((salary - totalMonthlyExpenses) / (salary / (workHours * 22))).toFixed(1)}ч
								</Typography>
								<Typography variant="body2" color="text.secondary">
									({(((salary - totalMonthlyExpenses) / salary) * 100).toFixed(1)}% от зарплаты)
								</Typography>
							</Box>
						)}
					</Box>
				</Box>

				<Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
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
