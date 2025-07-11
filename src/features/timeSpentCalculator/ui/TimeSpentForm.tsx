import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

type TimeSpentForm = {
	children: React.ReactNode;
	onSubmit: (data: z.infer<typeof timeSpentFormSchema>) => void;
};

const timeSpentFormSchema = z.object({
	workTime: z.object({
		startTime: z.iso.time(),
		endTime: z.iso.time(),
		lunchStartTime: z.iso.time(),
		lunchEndTime: z.iso.time(),
		includeLunch: z.boolean(),
	}),
	salary: z.number().positive().int().min(0, 'required'),
});

export const TimeSpentForm = ({ children, onSubmit }: TimeSpentForm) => {
	const form = useForm({
		mode: 'onBlur',
		defaultValues: {
			workTime: {
				startTime: '',
				endTime: '',
				lunchStartTime: '',
				lunchEndTime: '',
				includeLunch: false,
			},
		},
		resolver: zodResolver(timeSpentFormSchema),
	});
	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
		</FormProvider>
	);
};
