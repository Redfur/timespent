import type { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormItem, FormLabel, FormMessage, FormField as ShadcnFormField } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';

interface FormFieldProps {
	name: string;
	label: string;
	type?: 'text' | 'textarea' | 'time' | 'number';
	placeholder?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
	children?: ReactNode;
}

export const FormField = ({
	name,
	label,
	type = 'text',
	placeholder,
	required,
	disabled,
	className,
	children,
}: FormFieldProps) => {
	const form = useFormContext();

	return (
		<ShadcnFormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						{children ||
							(type === 'textarea' ? (
								<Textarea placeholder={placeholder} disabled={disabled} required={required} {...field} />
							) : (
								<Input type={type} placeholder={placeholder} disabled={disabled} required={required} {...field} />
							))}
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
