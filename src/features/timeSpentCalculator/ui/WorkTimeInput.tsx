import { Box, Card, CardContent, CardHeader, FormControlLabel, Switch } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TRANS_NS } from '../i18n';
import { useSettingsStore } from '../store/settingsStore';

export const WorkTimeInput = () => {
	const { t } = useTranslation(TRANS_NS);
	const { workTime, workHours, updateWorkTime } = useSettingsStore();

	const startTimeRef = useRef<Dayjs | undefined>(workTime.startTime);
	const endTimeRef = useRef<Dayjs | undefined>(workTime.endTime);
	const lunchStartTimeRef = useRef<Dayjs | undefined>(workTime.lunchStartTime);
	const lunchEndTimeRef = useRef<Dayjs | undefined>(workTime.lunchEndTime);

	// Сброс значений при изменении store (например, при загрузке)
	useEffect(() => {
		startTimeRef.current = workTime.startTime;
		endTimeRef.current = workTime.endTime;
		lunchStartTimeRef.current = workTime.lunchStartTime;
		lunchEndTimeRef.current = workTime.lunchEndTime;
	}, [workTime]);

	const handleCommit = () => {
		updateWorkTime({
			startTime: startTimeRef.current || workTime.startTime,
			endTime: endTimeRef.current || workTime.endTime,
			lunchStartTime: lunchStartTimeRef.current || workTime.lunchStartTime,
			lunchEndTime: lunchEndTimeRef.current || workTime.lunchEndTime,
		});
	};

	const handleTimeKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleCommit();
			(e.target as HTMLInputElement).blur();
		}
	};

	const handleStartTimeChange = (d: Dayjs | null) => {
		startTimeRef.current = d || workTime.startTime;
	};
	const handleEndTimeChange = (d: Dayjs | null) => {
		endTimeRef.current = d || workTime.endTime;
	};
	const handleLunchStartTimeChange = (d: Dayjs | null) => {
		lunchStartTimeRef.current = d || workTime.lunchStartTime;
	};
	const handleLunchEndTimeChange = (d: Dayjs | null) => {
		lunchEndTimeRef.current = d || workTime.lunchEndTime;
	};

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
							maxTime={endTimeRef.current}
							defaultValue={workTime.startTime}
							fullWidth
							onChange={handleStartTimeChange}
							onBlur={handleCommit}
							onKeyDown={handleTimeKeyDown}
						/>
						<TimeField
							label={t('workTimeInput.endTime')}
							format="HH:mm"
							minTime={startTimeRef.current}
							defaultValue={workTime.endTime}
							fullWidth
							onChange={handleEndTimeChange}
							onBlur={handleCommit}
							onKeyDown={handleTimeKeyDown}
						/>
					</Box>

					{/* Переключатель времени обеда */}
					<FormControlLabel
						control={
							<Switch
								checked={workTime.includeLunch}
								onChange={e => updateWorkTime({ includeLunch: e.target.checked })}
							/>
						}
						label={t('workTimeInput.includeLunch')}
					/>

					{/* Время обеда */}
					{workTime.includeLunch && (
						<Box sx={{ display: 'flex', gap: 2 }}>
							<TimeField
								label={t('workTimeInput.lunchStart')}
								format="HH:mm"
								maxTime={lunchEndTimeRef.current}
								defaultValue={workTime.lunchStartTime}
								fullWidth
								onChange={handleLunchStartTimeChange}
								onBlur={handleCommit}
								onKeyDown={handleTimeKeyDown}
							/>
							<TimeField
								label={t('workTimeInput.lunchEnd')}
								format="HH:mm"
								minTime={lunchStartTimeRef.current}
								defaultValue={workTime.lunchEndTime}
								fullWidth
								onChange={handleLunchEndTimeChange}
								onBlur={handleCommit}
								onKeyDown={handleTimeKeyDown}
							/>
						</Box>
					)}
				</Box>
			</CardContent>
		</Card>
	);
};
