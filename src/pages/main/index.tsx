import { Container } from '@mui/material';
import { ThemeChange } from '~/features/themeChange';
import { WorkTimeInput } from '~/features/workTime';

export const MainPage = () => {
  return (
    <Container maxWidth="md">
      <ThemeChange />
      <h1>Ради чего вы работаете?</h1>
      <WorkTimeInput />
    </Container>
  );
};
