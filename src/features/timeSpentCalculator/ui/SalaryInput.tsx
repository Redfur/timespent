import { zodResolver } from '@hookform/resolvers/zod';
import { RussianRuble } from 'lucide-react';
import { Controller, FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Typography } from '@/shared/ui/typography';
import { TRANS_NS } from '../i18n';
import { useSettingsStore } from '../store/settingsStore';

const formatCurrency = (value: string) => {
	const cleanedString = value.trim().replace(/\D/g, '');
	const formattedString = cleanedString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	return formattedString;
};

const salarySchema = z.object({
	salary: z.number().positive().int().min(0, 'required'),
});

export const SalaryInput = () => {
	const { t } = useTranslation(TRANS_NS, { keyPrefix: 'salaryInput' });
	const { salary, updateSalary } = useSettingsStore();

	// Сброс значения в поле при изменении salary в store (например, при загрузке)
	// useEffect(() => {
	// 	form.setValue('salary', salary.toLocaleString());
	// }, [salary]);

	const form = useForm({
		mode: 'onBlur',
		defaultValues: {
			salary: salary,
		},
		resolver: zodResolver(salarySchema),
	});
	const { handleSubmit } = form;

	const onSubmit: SubmitHandler<z.infer<typeof salarySchema>> = data => {
		console.log(data);
		updateSalary(Number(data.salary));
	};

	return (
		<Card className="gap-2">
			<CardHeader>
				<CardTitle>{t('title')}</CardTitle>
			</CardHeader>
			<CardContent>
				<Typography className="mb-2">{t('description')}</Typography>
				<FormProvider {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
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
