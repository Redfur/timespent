import { FormControl, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
		<FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
			<Select value={value} onChange={e => onChange(e.target.value as SpentBy)} label={label || t('periods.label')}>
				{periods.map(period => (
					<MenuItem key={period.value} value={period.value}>
						{period.label}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};
