import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';

const COLORS = [
	'#ff59d6', // розовый
	'#2fd96d', // зеленый
	'#ffb24f', // оранжевый
	'#4a90e2', // синий
	'#9c27b0', // фиолетовый
	'#f44336', // красный
	'#00bcd4', // голубой
	'#8bc34a', // светло-зеленый
	'#ff9800', // оранжевый
	'#795548', // коричневый
];

interface ColorPickerProps {
	name: string;
	label: string;
	className?: string;
}

export const ColorPicker = ({ name, label, className }: ColorPickerProps) => {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className={className}>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<div className="flex gap-2 flex-wrap">
							{COLORS.map(color => (
								<div
									key={color}
									role="button"
									tabIndex={0}
									onKeyDown={e => {
										if (e.key === 'Enter' || e.key === ' ') {
											field.onChange(color);
										}
									}}
									className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-colors ${
										field.value === color ? 'border-black dark:border-white' : 'border-gray-300 dark:border-gray-600'
									} hover:border-black dark:hover:border-white`}
									style={{ backgroundColor: color }}
									onClick={() => field.onChange(color)}
								/>
							))}
						</div>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
