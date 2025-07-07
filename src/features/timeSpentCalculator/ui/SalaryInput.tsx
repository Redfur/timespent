import { Card, CardContent, CardHeader, InputAdornment, TextField, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
				<TextField
					inputRef={inputRef}
					slotProps={{
						input: {
							startAdornment: <InputAdornment position="start">&#8381;</InputAdornment>,
							endAdornment: (
								<InputAdornment position="end">
									{t('rubles_a_month', {
										count: salary,
									})}
								</InputAdornment>
							),
						},
					}}
					inputMode="numeric"
					placeholder="50 000"
					autoComplete="off"
					onBlur={handleCommit}
					onKeyDown={handleKeyDown}
					defaultValue={salary.toLocaleString()}
					fullWidth
				/>
			</CardContent>
		</Card>
	);
};
