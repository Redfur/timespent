import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { I18nextProvider } from 'react-i18next';
import i18n from '~/shared/lib/i18n/i18n';

const darkTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  // useEffect(() => {
  //   // Логика для изменения языка (если нужно)
  // }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={darkTheme} noSsr defaultMode="dark">
      <I18nProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          {children}
        </LocalizationProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};
