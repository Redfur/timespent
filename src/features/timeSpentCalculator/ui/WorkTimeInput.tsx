import { Box, Card, CardContent, CardHeader } from '@mui/material';
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
	const [endTime, setEndTime] = useState<Dayjs>(dayjs().set('hour', 17).set('minute', 0));

	const workHours = endTime.diff(startTime, 'hour');

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
			</CardContent>
		</Card>
	);
};
