import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { Typography } from '@/shared/ui/typography';
import { TRANS_NS } from '../i18n';
import type { WorkTimeSettings } from '../store/settingsStore';
import { type ExpenseSegment, WORK_DAYS_PER_MONTH } from './WorkDayProgress';

const HOUR_HEIGHT_PX = 56;
const MINUTES_PER_DAY_CAP = 24 * 60;

interface CalendarPiece {
	key: string;
	groupName: string;
	color: string;
	startMin: number; // реальные минуты от startTime
	endMin: number;
	segment: ExpenseSegment;
}

interface CalendarLayout {
	pieces: CalendarPiece[];
	lunch: { startMin: number; endMin: number } | null;
	timelineMinutes: number;
	overflowWorkMinutes: number;
	endOfWorkdayMin: number;
}

const buildCalendarLayout = (segments: ExpenseSegment[], workTime: WorkTimeSettings): CalendarLayout => {
	const { startTime, endTime, lunchStartTime, lunchEndTime, includeLunch } = workTime;
	const endMin = endTime.diff(startTime, 'minute');

	const rawLunchStart = includeLunch ? lunchStartTime.diff(startTime, 'minute') : -1;
	const rawLunchEnd = includeLunch ? lunchEndTime.diff(startTime, 'minute') : -1;
	// Защита от некорректного ввода (схема валидации не проверяет порядок времён обеда)
	const hasLunch = includeLunch && rawLunchStart >= 0 && rawLunchEnd > rawLunchStart;
	const lunchStartMin = hasLunch ? rawLunchStart : -1;
	const lunchEndMin = hasLunch ? rawLunchEnd : -1;
	const lunchDurationMin = hasLunch ? lunchEndMin - lunchStartMin : 0;

	// Сколько "рабочих" минут вообще может уместиться в сутках с учётом одного перерыва на обед
	const workMinuteCap = hasLunch ? MINUTES_PER_DAY_CAP - lunchDurationMin : MINUTES_PER_DAY_CAP;

	const pieces: CalendarPiece[] = [];
	let cursor = 0;
	let overflowWorkMinutes = 0;

	for (const segment of segments) {
		// Без округления до целых минут — иначе погрешность округления каждого сегмента накапливается
		// и суммарная длительность выходит за пределы расписанного дня даже без реального переполнения.
		const dailyMinutes = Math.max(1, (segment.hours / WORK_DAYS_PER_MONTH) * 60);
		const ws = cursor;
		let we = cursor + dailyMinutes;
		cursor = we;

		// Обрезаем по 24-часовому пределу, остаток уходит в overflow (в рабочих минутах)
		if (ws >= workMinuteCap) {
			overflowWorkMinutes += we - ws;
			continue;
		}
		if (we > workMinuteCap) {
			overflowWorkMinutes += we - workMinuteCap;
			we = workMinuteCap;
		}
		if (we <= ws) continue;

		const push = (startMin: number, pieceEndMin: number) => {
			if (pieceEndMin > startMin) {
				pieces.push({
					key: `${segment.groupName}-${startMin}`,
					groupName: segment.groupName,
					color: segment.color,
					startMin,
					endMin: pieceEndMin,
					segment,
				});
			}
		};

		if (hasLunch && ws < lunchStartMin && lunchStartMin < we) {
			// Кусок реально пересекает обед — считаем границы раздельно
			push(ws, lunchStartMin); // часть до обеда: без сдвига
			push(lunchEndMin, we + lunchDurationMin); // часть после обеда: сдвинута на длительность обеда
		} else if (hasLunch && ws >= lunchStartMin) {
			// Целиком после начала обеда → сдвигаем обе границы
			push(ws + lunchDurationMin, we + lunchDurationMin);
		} else {
			// Целиком до обеда (или обед выключен) → без сдвига
			push(ws, we);
		}
	}

	const maxEndMin = Math.max(endMin, hasLunch ? lunchEndMin : 0, 0, ...pieces.map(p => p.endMin));
	const timelineMinutes = Math.ceil(maxEndMin / 60) * 60;

	return {
		pieces,
		lunch: hasLunch ? { startMin: lunchStartMin, endMin: lunchEndMin } : null,
		timelineMinutes,
		overflowWorkMinutes,
		endOfWorkdayMin: endMin,
	};
};

interface WorkDayCalendarProps {
	segments: ExpenseSegment[];
	workTime: WorkTimeSettings;
}

export const WorkDayCalendar = ({ segments, workTime }: WorkDayCalendarProps) => {
	const { t } = useTranslation(TRANS_NS);
	const layout = useMemo(() => buildCalendarLayout(segments, workTime), [segments, workTime]);
	const pxPerMin = HOUR_HEIGHT_PX / 60;
	const hourCount = layout.timelineMinutes / 60;
	const overflowHours = Math.ceil(layout.overflowWorkMinutes / 60);

	return (
		<div>
			<div className="relative flex">
				<div className="relative w-14 flex-none" style={{ height: hourCount * HOUR_HEIGHT_PX }}>
					{Array.from({ length: hourCount + 1 }, (_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: фиксированная последовательность часовых меток, порядок не меняется
							key={`hour-label-${i}`}
							className="absolute left-0 right-2 -translate-y-1/2 text-right text-xs text-muted-foreground"
							style={{ top: i * HOUR_HEIGHT_PX }}
						>
							{workTime.startTime.add(i, 'hour').format('HH:mm')}
						</div>
					))}
				</div>

				<div className="relative flex-1 border-l border-border" style={{ height: hourCount * HOUR_HEIGHT_PX }}>
					{Array.from({ length: hourCount + 1 }, (_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: фиксированная последовательность часовых линий, порядок не меняется
							key={`hour-line-${i}`}
							className="absolute left-0 right-0 border-t border-border/50"
							style={{ top: i * HOUR_HEIGHT_PX }}
						/>
					))}

					<div
						className="absolute left-0 right-0 border-t-2 border-dashed border-muted-foreground/70"
						style={{ top: layout.endOfWorkdayMin * pxPerMin }}
					>
						<span className="absolute -top-4 right-1 text-[10px] text-muted-foreground">
							{t('workTimeInput.endTime')}
						</span>
					</div>

					{layout.lunch && (
						<div
							className="absolute left-0 right-0 flex items-center justify-center rounded-sm bg-muted text-xs text-muted-foreground"
							style={{
								top: layout.lunch.startMin * pxPerMin,
								height: (layout.lunch.endMin - layout.lunch.startMin) * pxPerMin,
							}}
						>
							{t('workTimeInput.includeLunch')}
						</div>
					)}

					{layout.pieces.map(piece => {
						const heightPx = Math.max(2, (piece.endMin - piece.startMin) * pxPerMin);
						const isSavings = piece.segment.isSavings;
						return (
							<Tooltip key={piece.key}>
								<TooltipTrigger asChild>
									<button
										type="button"
										className={cn(
											'absolute left-0 right-0 overflow-hidden truncate px-1 text-left text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring',
											isSavings ? 'bg-muted text-muted-foreground' : 'text-white dark:text-dark',
										)}
										style={{
											top: piece.startMin * pxPerMin,
											height: heightPx,
											...(isSavings ? {} : { backgroundColor: piece.color }),
										}}
									>
										{heightPx >= 18 ? piece.groupName : ''}
									</button>
								</TooltipTrigger>
								<TooltipContent side="right">
									<div className="font-medium">{piece.groupName}</div>
									<div>{piece.segment.formattedTime}</div>
									<div>
										{workTime.startTime.add(piece.startMin, 'minute').format('HH:mm')}
										{' – '}
										{workTime.startTime.add(piece.endMin, 'minute').format('HH:mm')}
									</div>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</div>
			{overflowHours > 0 && (
				<Typography variant="caption" color="secondary" className="mt-1 block">
					{t('progress.overflow', { count: overflowHours })}
				</Typography>
			)}
		</div>
	);
};
