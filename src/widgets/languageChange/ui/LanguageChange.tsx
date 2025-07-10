import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_STORAGE_KEY } from '@/shared/lib/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
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

	const handleLanguageChange = (newLanguage: string) => {
		i18n.changeLanguage(newLanguage);
		// Сохраняем выбранный язык в localStorage
		localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
	};

	return (
		<Select value={i18n.language} onValueChange={handleLanguageChange}>
			<SelectTrigger className="w-32">
				<SelectValue placeholder={t('label')} />
			</SelectTrigger>
			<SelectContent>
				{languages.map(lang => (
					<SelectItem key={lang.code} value={lang.code}>
						{lang.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
