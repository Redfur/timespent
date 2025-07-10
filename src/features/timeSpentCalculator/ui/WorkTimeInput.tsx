import { Card, CardContent, CardHeader, FormControlLabel, Switch } from '@mui/material';
import type { Dayjs } from 'dayjs';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
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
				<div className="space-y-4">
					{/* Рабочее время */}
					<div className="flex gap-4">
						<div className="space-y-2 flex-1">
							<Label htmlFor="start-time">{t('workTimeInput.startTime')}</Label>
							<Input
								id="start-time"
								type="time"
								defaultValue={workTime.startTime.format('HH:mm')}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									const time = e.target.value;
									if (time) {
										const [hours, minutes] = time.split(':');
										const newTime = workTime.startTime.hour(Number.parseInt(hours)).minute(Number.parseInt(minutes));
										handleStartTimeChange(newTime);
									}
								}}
								onBlur={handleCommit}
								onKeyDown={handleTimeKeyDown}
							/>
						</div>
						<div className="space-y-2 flex-1">
							<Label htmlFor="end-time">{t('workTimeInput.endTime')}</Label>
							<Input
								id="end-time"
								type="time"
								defaultValue={workTime.endTime.format('HH:mm')}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									const time = e.target.value;
									if (time) {
										const [hours, minutes] = time.split(':');
										const newTime = workTime.endTime.hour(Number.parseInt(hours)).minute(Number.parseInt(minutes));
										handleEndTimeChange(newTime);
									}
								}}
								onBlur={handleCommit}
								onKeyDown={handleTimeKeyDown}
							/>
						</div>
					</div>

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
						<div className="flex gap-4">
							<div className="space-y-2 flex-1">
								<Label htmlFor="lunch-start">{t('workTimeInput.lunchStart')}</Label>
								<Input
									id="lunch-start"
									type="time"
									defaultValue={workTime.lunchStartTime.format('HH:mm')}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const time = e.target.value;
										if (time) {
											const [hours, minutes] = time.split(':');
											const newTime = workTime.lunchStartTime
												.hour(Number.parseInt(hours))
												.minute(Number.parseInt(minutes));
											handleLunchStartTimeChange(newTime);
										}
									}}
									onBlur={handleCommit}
									onKeyDown={handleTimeKeyDown}
								/>
							</div>
							<div className="space-y-2 flex-1">
								<Label htmlFor="lunch-end">{t('workTimeInput.lunchEnd')}</Label>
								<Input
									id="lunch-end"
									type="time"
									defaultValue={workTime.lunchEndTime.format('HH:mm')}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const time = e.target.value;
										if (time) {
											const [hours, minutes] = time.split(':');
											const newTime = workTime.lunchEndTime
												.hour(Number.parseInt(hours))
												.minute(Number.parseInt(minutes));
											handleLunchEndTimeChange(newTime);
										}
									}}
									onBlur={handleCommit}
									onKeyDown={handleTimeKeyDown}
								/>
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
