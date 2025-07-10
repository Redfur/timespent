import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { RussianRuble } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { TRANS_NS } from '../i18n';
import { useSettingsStore } from '../store/settingsStore';

const formatCurrency = (value: string) => {
	const cleanedString = value.trim().replace(/\D/g, '');
	const formattedString = cleanedString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	return formattedString;
};

export const SalaryInput = () => {
	const { t } = useTranslation(TRANS_NS, { keyPrefix: 'salaryInput' });
	const { salary, updateSalary } = useSettingsStore();
	const inputRef = useRef<HTMLInputElement>(null);

	// Сброс значения в поле при изменении salary в store (например, при загрузке)
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.value = salary.toLocaleString();
		}
	}, [salary]);

	const handleCommit = () => {
		if (inputRef.current) {
			const formattedValue = formatCurrency(inputRef.current.value);
			inputRef.current.value = formattedValue;
			const numericValue = Number(formattedValue.replace(/\s/g, ''));
			if (!Number.isNaN(numericValue)) {
				updateSalary(numericValue);
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleCommit();
			if (inputRef.current) inputRef.current.blur();
		}
	};

	return (
		<Card>
			<CardHeader title={t('title')} />
			<CardContent>
				<Typography mb={2}>{t('description')}</Typography>
				<div className="space-y-2">
					<Label htmlFor="salary">{t('title')}</Label>
					<div className="relative">
						<RussianRuble className="absolute left-2 top-1/2 size-4 transform -translate-y-1/2 pointer-events-none" />
						<Input
							ref={inputRef}
							id="salary"
							inputMode="numeric"
							placeholder="50 000"
							autoComplete="off"
							onBlur={handleCommit}
							onKeyDown={handleKeyDown}
							defaultValue={salary.toLocaleString()}
							className="pl-8 pr-32"
						/>
						<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
							{t('rubles_a_month', {
								count: salary,
							})}
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
