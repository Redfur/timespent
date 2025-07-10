import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { TRANS_NS } from '../i18n';
import { SpentBy } from '../types';

interface PeriodSelectorProps {
	value: SpentBy;
	onChange: (period: SpentBy) => void;
	label?: string;
}

export const PeriodSelector = ({ value, onChange, label }: PeriodSelectorProps) => {
	const { t } = useTranslation(TRANS_NS);

	const periods = [
		{ value: SpentBy.DAY, label: t('periods.day') },
		{ value: SpentBy.MONTH, label: t('periods.month') },
		{ value: SpentBy.YEAR, label: t('periods.year') },
	];

	return (
		<Select value={value} onValueChange={newValue => onChange(newValue as SpentBy)}>
			<SelectTrigger className="w-26">
				<SelectValue placeholder={label || t('periods.label')} />
			</SelectTrigger>
			<SelectContent>
				{periods.map(period => (
					<SelectItem key={period.value} value={period.value}>
						{period.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
