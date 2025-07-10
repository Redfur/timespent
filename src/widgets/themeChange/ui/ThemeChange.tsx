import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Button } from '@/shared/ui/button';
import { TRANS_NS } from '../i18n';

export const ThemeChange = () => {
	const { theme, toggleTheme } = useTheme();
	const { t } = useTranslation(TRANS_NS);

	return (
		<div className="flex gap-1">
			<Button
				variant={theme === 'light' ? 'default' : 'outline'}
				size="icon"
				onClick={() => {
					if (theme !== 'light') toggleTheme();
				}}
				aria-label={t('light')}
			>
				<Sun className="h-4 w-4" />
			</Button>
			<Button
				variant={theme === 'dark' ? 'default' : 'outline'}
				size="icon"
				onClick={() => {
					if (theme !== 'dark') toggleTheme();
				}}
				aria-label={t('dark')}
			>
				<Moon className="h-4 w-4" />
			</Button>
		</div>
	);
};
