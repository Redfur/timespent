import { FormControl, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_STORAGE_KEY } from '@/shared/lib/i18n';
import { TRANS_NS } from '../i18n';

const languages = [
	{ code: 'ru', name: 'Русский' },
	{ code: 'en', name: 'English' },
];

export const LanguageChange = () => {
	const { i18n, t } = useTranslation(TRANS_NS);

	// Инициализация языка из localStorage при загрузке
	useEffect(() => {
		const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
		if (savedLanguage && languages.some(lang => lang.code === savedLanguage)) {
			i18n.changeLanguage(savedLanguage);
		}
	}, [i18n]);

	const handleLanguageChange = (event: SelectChangeEvent<string>) => {
		const newLanguage = event.target.value;
		i18n.changeLanguage(newLanguage);
		// Сохраняем выбранный язык в localStorage
		localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
	};

	return (
		<FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
			<Select value={i18n.language} onChange={handleLanguageChange} label={t('label')}>
				{languages.map(lang => (
					<MenuItem key={lang.code} value={lang.code}>
						{lang.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};
