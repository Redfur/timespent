import { Box, Card, CardContent, CardHeader, FormControlLabel, Switch } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TRANS_NS } from '../i18n';

interface WorkTimeInputProps {
	onHoursChange?: (hours: number) => void;
}

export const WorkTimeInput = ({ onHoursChange }: WorkTimeInputProps) => {
	const { t } = useTranslation(TRANS_NS);
	const [startTime, setStartTime] = useState<Dayjs>(dayjs().set('hour', 9).set('minute', 0));
	const [endTime, setEndTime] = useState<Dayjs>(dayjs().set('hour', 18).set('minute', 0));
	const [lunchStartTime, setLunchStartTime] = useState<Dayjs>(dayjs().set('hour', 13).set('minute', 0));
	const [lunchEndTime, setLunchEndTime] = useState<Dayjs>(dayjs().set('hour', 14).set('minute', 0));
	const [includeLunch, setIncludeLunch] = useState(true);

	// Рассчитываем рабочие часы с учетом обеда
	const calculateWorkHours = () => {
		const totalHours = endTime.diff(startTime, 'hour', true);

		if (includeLunch) {
			const lunchHours = lunchEndTime.diff(lunchStartTime, 'hour', true);
			return Math.max(0, totalHours - lunchHours);
		}

		return totalHours;
	};

	const workHours = calculateWorkHours();

	// Уведомляем родительский компонент об изменении часов
	useEffect(() => {
		onHoursChange?.(workHours);
	}, [workHours, onHoursChange]);

	return (
		<Card>
			<CardHeader
				title={
					workHours > 0
						? `${t('workTimeInput.title')} - ${t('hours', {
								count: workHours,
								ns: 'common',
							})}`
						: t('workTimeInput.title')
				}
			/>
			<CardContent>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					{/* Рабочее время */}
					<Box sx={{ display: 'flex', gap: 2 }}>
						<TimeField
							label={t('workTimeInput.startTime')}
							format="HH:mm"
							maxTime={endTime}
							value={startTime}
							fullWidth
							onChange={d => setStartTime(d || dayjs('09:00'))}
						/>
						<TimeField
							label={t('workTimeInput.endTime')}
							format="HH:mm"
							minTime={startTime}
							value={endTime}
							fullWidth
							onChange={d => setEndTime(d || dayjs('17:00'))}
						/>
					</Box>

					{/* Переключатель времени обеда */}
					<FormControlLabel
						control={<Switch checked={includeLunch} onChange={e => setIncludeLunch(e.target.checked)} />}
						label={t('workTimeInput.includeLunch')}
					/>

					{/* Время обеда */}
					{includeLunch && (
						<Box sx={{ display: 'flex', gap: 2 }}>
							<TimeField
								label={t('workTimeInput.lunchStart')}
								format="HH:mm"
								maxTime={lunchEndTime}
								value={lunchStartTime}
								fullWidth
								onChange={d => setLunchStartTime(d || dayjs('13:00'))}
							/>
							<TimeField
								label={t('workTimeInput.lunchEnd')}
								format="HH:mm"
								minTime={lunchStartTime}
								value={lunchEndTime}
								fullWidth
								onChange={d => setLunchEndTime(d || dayjs('14:00'))}
							/>
						</Box>
					)}
				</Box>
			</CardContent>
		</Card>
	);
};
