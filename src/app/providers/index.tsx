import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={darkTheme} noSsr defaultMode="dark">
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
