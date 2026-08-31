import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { TRANS_NS } from '../i18n';
import { type WorkTimeFormData, workTimeSchema } from '../lib/validation/schemas';
import { dayjsToTimeString, timeStringToDayjs } from '../lib/validation/utils';
import { useSettingsStore } from '../store/settingsStore';

export const WorkTimeInput = () => {
	const { t } = useTranslation(TRANS_NS);
	const { workTime, workHours, updateWorkTime } = useSettingsStore();

	const { register, handleSubmit, watch, setValue, reset } = useForm<WorkTimeFormData>({
		mode: 'onBlur',
		resolver: zodResolver(workTimeSchema),
		defaultValues: {
			startTime: dayjsToTimeString(workTime.startTime),
			endTime: dayjsToTimeString(workTime.endTime),
			lunchStartTime: dayjsToTimeString(workTime.lunchStartTime),
			lunchEndTime: dayjsToTimeString(workTime.lunchEndTime),
			includeLunch: workTime.includeLunch,
		},
	});

	// Сброс значений при изменении store (например, при загрузке)
	useEffect(() => {
		reset({
			startTime: dayjsToTimeString(workTime.startTime),
			endTime: dayjsToTimeString(workTime.endTime),
			lunchStartTime: dayjsToTimeString(workTime.lunchStartTime),
			lunchEndTime: dayjsToTimeString(workTime.lunchEndTime),
			includeLunch: workTime.includeLunch,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [workTime, reset]);

	const includeLunch = watch('includeLunch');

	const commit = handleSubmit(data => {
		updateWorkTime({
			startTime: timeStringToDayjs(data.startTime, workTime.startTime),
			endTime: timeStringToDayjs(data.endTime, workTime.endTime),
			lunchStartTime: timeStringToDayjs(data.lunchStartTime, workTime.lunchStartTime),
			lunchEndTime: timeStringToDayjs(data.lunchEndTime, workTime.lunchEndTime),
			includeLunch: data.includeLunch,
		});
	});

	const handleTimeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			commit();
			e.currentTarget.blur();
		}
	};

	const handleIncludeLunchChange = (checked: boolean) => {
		setValue('includeLunch', checked);
		commit();
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					{workHours > 0
						? `${t('workTimeInput.title')} - ${t('hours', {
								count: workHours,
								ns: 'common',
							})}`
						: t('workTimeInput.title')}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Рабочее время */}
					<div className="flex gap-4">
						<div className="space-y-2 flex-1">
							<Label htmlFor="start-time">{t('workTimeInput.startTime')}</Label>
							<Input
								id="start-time"
								type="time"
								{...register('startTime')}
								onBlur={commit}
								onKeyDown={handleTimeKeyDown}
							/>
						</div>
						<div className="space-y-2 flex-1">
							<Label htmlFor="end-time">{t('workTimeInput.endTime')}</Label>
							<Input id="end-time" type="time" {...register('endTime')} onBlur={commit} onKeyDown={handleTimeKeyDown} />
						</div>
					</div>

					{/* Переключатель времени обеда */}
					<Label className="flex items-center gap-2">
						<Switch checked={includeLunch} onCheckedChange={handleIncludeLunchChange} />
						{t('workTimeInput.includeLunch')}
					</Label>

					{/* Время обеда */}
					{includeLunch && (
						<div className="flex gap-4">
							<div className="space-y-2 flex-1">
								<Label htmlFor="lunch-start">{t('workTimeInput.lunchStart')}</Label>
								<Input
									id="lunch-start"
									type="time"
									{...register('lunchStartTime')}
									onBlur={commit}
									onKeyDown={handleTimeKeyDown}
								/>
							</div>
							<div className="space-y-2 flex-1">
								<Label htmlFor="lunch-end">{t('workTimeInput.lunchEnd')}</Label>
								<Input
									id="lunch-end"
									type="time"
									{...register('lunchEndTime')}
									onBlur={commit}
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
