import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { type DefaultValues, type FieldValues, FormProvider, useForm } from 'react-hook-form';
import type { z } from 'zod';

interface FormProps<FV extends FieldValues> {
	schema: z.ZodSchema<unknown, FV>;
	onSubmit: (data: FV) => void;
	defaultValues: DefaultValues<FV>;
	children: ReactNode;
	className?: string;
}

export function Form<FV extends FieldValues>(props: FormProps<FV>) {
	const { schema, onSubmit, defaultValues, children, className } = props;

	const form = useForm<FV>({
		resolver: zodResolver<FV, any, any>(schema),
		defaultValues,
	});

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={className}>
				{children}
			</form>
		</FormProvider>
	);
}
