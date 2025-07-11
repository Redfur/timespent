import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

interface UseFormWithValidationProps<TData> {
	schema: z.ZodSchema<TData>;
	defaultValues?: Partial<TData>;
	onSubmit: (data: TData) => void;
}

export function useFormWithValidation<TData>({ schema, defaultValues, onSubmit }: UseFormWithValidationProps<TData>) {
	const form = useForm({
		resolver: zodResolver(schema as any),
		defaultValues: defaultValues as any,
	});

	const handleSubmit = form.handleSubmit(onSubmit as any);

	return {
		form,
		handleSubmit,
		register: form.register,
		watch: form.watch,
		setValue: form.setValue,
		getValues: form.getValues,
		formState: form.formState,
		reset: form.reset,
	};
}
