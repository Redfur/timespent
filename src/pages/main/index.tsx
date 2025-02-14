import { Container, Stack } from '@mui/material';
import { SalaryInput } from '~/features/salaryInput';
import { ThemeChange } from '~/features/themeChange';
import { WorkTimeInput } from '~/features/workTime';

export const MainPage = () => {
  return (
    <Container maxWidth="md">
      <ThemeChange />
      <h1>Ради чего вы работаете?</h1>
      <Stack spacing={2}>
        <WorkTimeInput />
        <SalaryInput />
      </Stack>
    </Container>
  );
};
