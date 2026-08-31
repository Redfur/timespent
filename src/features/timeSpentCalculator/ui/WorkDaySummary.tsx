import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { Typography } from '@/shared/ui/typography';
import { TRANS_NS } from '../i18n';
import { type ExpenseSegment, formatTime } from './WorkDayProgress';

interface WorkDaySummaryProps {
	segments: ExpenseSegment[];
	salary: number;
	totalMonthlyExpenses: number;
}

export const WorkDaySummary = ({ segments, salary, totalMonthlyExpenses }: WorkDaySummaryProps) => {
	const { t } = useTranslation(TRANS_NS);

	// Часовая ставка выводится из уже посчитанных сегментов (amount/hours были получены
	// делением на одну и ту же ставку в useExpenseSegments), чтобы не требовать workHours отдельным пропсом.
	const hourlyRate = segments[0].amount / segments[0].hours;
	const isDeficit = totalMonthlyExpenses >= salary;
	const percentage = (totalMonthlyExpenses / salary) * 100;
	const savingsSegment = segments.find(s => s.isSavings);
	const deficitTime = isDeficit ? formatTime((totalMonthlyExpenses - salary) / hourlyRate, t) : null;

	return (
		<Card className="gap-4">
			<CardHeader>
				<CardTitle>{t('progress.summary')}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-5">
				{/* Hero: свободное время в день или дефицит */}
				<div>
					<Typography variant="overline">
						{isDeficit ? t('progress.deficitPerDay') : t('progress.freeTimePerDay')}
					</Typography>
					<Typography
						component="div"
						className={cn(
							'text-4xl font-semibold',
							isDeficit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400',
						)}
					>
						{isDeficit ? deficitTime : savingsSegment?.formattedTime}
					</Typography>
				</div>

				{/* Meter: % от зарплаты */}
				<div>
					<div className="flex items-baseline justify-between">
						<Typography variant="body2" color="secondary">
							{t('progress.expensesPercentage', { percentage: percentage.toFixed(1) })}
						</Typography>
					</div>
					<div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
						<div
							className={cn('h-full rounded-full', isDeficit ? 'bg-destructive' : 'bg-primary')}
							style={{ width: `${Math.min(percentage, 100)}%` }}
						/>
					</div>
					<Typography variant="caption" color="secondary" className="mt-1 block">
						{t('progress.expensesOfSalary', {
							spent: totalMonthlyExpenses.toLocaleString(),
							salary: salary.toLocaleString(),
						})}
					</Typography>
				</div>

				{/* Разбивка по категориям: тонкая полоса + легенда */}
				<div>
					<Typography variant="overline" className="mb-1.5 block">
						{t('progress.breakdown')}
					</Typography>
					<div className="flex h-3 gap-0.5 overflow-hidden rounded-md">
						{segments.map(segment => (
							<Tooltip key={segment.groupName}>
								<TooltipTrigger asChild>
									<div
										className={cn('h-full', segment.isSavings && 'bg-muted')}
										style={{
											flex: `${Math.max(segment.percentage, 0.5)} 0 auto`,
											...(segment.isSavings ? {} : { backgroundColor: segment.color }),
										}}
									/>
								</TooltipTrigger>
								<TooltipContent side="bottom">
									<div className="font-medium">{segment.groupName}</div>
									<div>{segment.amount.toLocaleString()} ₽</div>
									<div>{segment.percentage.toFixed(1)}%</div>
								</TooltipContent>
							</Tooltip>
						))}
					</div>
					<ul className="mt-2 space-y-1">
						{segments.map((segment, index) => (
							<li key={segment.groupName} className="flex items-center justify-between gap-2 text-sm">
								<span className="flex items-center gap-2 truncate">
									<span
										className={cn('size-2 flex-none rounded-full', segment.isSavings && 'bg-muted')}
										style={segment.isSavings ? undefined : { backgroundColor: segment.color }}
									/>
									<span className={cn('truncate', index === 0 && 'font-medium')}>{segment.groupName}</span>
								</span>
								<span className="flex-none text-muted-foreground">{segment.formattedTime}</span>
							</li>
						))}
					</ul>
				</div>
			</CardContent>
		</Card>
	);
};
