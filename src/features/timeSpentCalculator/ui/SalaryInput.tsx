import { zodResolver } from '@hookform/resolvers/zod';
import { RussianRuble } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Typography } from '@/shared/ui/typography';
import { TRANS_NS } from '../i18n';
import { type SalaryFormData, salarySchema } from '../lib/validation/schemas';
import { useSettingsStore } from '../store/settingsStore';

export const SalaryInput = () => {
	const { t } = useTranslation(TRANS_NS, { keyPrefix: 'salaryInput' });
	const { salary, updateSalary } = useSettingsStore();

	const form = useForm({
		mode: 'onBlur',
		defaultValues: {
			salary: salary,
		},
		resolver: zodResolver(salarySchema),
	});
	const { handleSubmit, reset } = form;

	// Сброс значения в поле при изменении salary в store (например, при загрузке)
	useEffect(() => {
		reset({ salary });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salary, reset]);

	const onSubmit: SubmitHandler<SalaryFormData> = data => {
		updateSalary(data.salary);
	};

	const commit = handleSubmit(onSubmit);

	return (
		<Card className="gap-2">
			<CardHeader>
				<CardTitle>{t('title')}</CardTitle>
			</CardHeader>
			<CardContent>
				<Typography className="mb-2">{t('description')}</Typography>
				<FormProvider {...form}>
					<form onSubmit={commit} className="space-y-2">
						<Label htmlFor="salary">{t('title')}</Label>
						<Controller
							control={form.control}
							name="salary"
							render={({ field, fieldState: { error } }) => (
								<div className="relative">
									<RussianRuble className="absolute left-2 top-1/2 size-4 transform -translate-y-1/2 pointer-events-none" />
									<Input
										id="salary"
										inputMode="numeric"
										type="number"
										placeholder="50 000"
										autoComplete="off"
										{...field}
										onChange={e => {
											field.onChange(e.target.valueAsNumber);
										}}
										onBlur={() => {
											field.onBlur();
											commit();
										}}
										className="pl-8 pr-32"
									/>
									<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm pointer-events-none">
										{error ? (
											<span className="text-red-500">{error?.message}</span>
										) : (
											<span className="text-muted-foreground">
												{t('rubles_a_month', {
													count: field.value,
												})}
											</span>
										)}
									</span>
								</div>
							)}
						/>
					</form>
				</FormProvider>
			</CardContent>
		</Card>
	);
};
