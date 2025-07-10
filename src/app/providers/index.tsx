import { I18nextProvider } from 'react-i18next';
import i18n from '@/shared/lib/i18n/i18n';
import { ThemeProvider } from './ThemeProvider';

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider>
			<I18nProvider>{children}</I18nProvider>
		</ThemeProvider>
	);
};
