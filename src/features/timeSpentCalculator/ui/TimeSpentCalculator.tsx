import { Stack } from '@mui/material';
import { SalaryInput } from './SalaryInput';
import { WorkTimeInput } from './WorkTimeInput';

export const TimeSpentCalculator = () => {
  return (
    <>
      <h1>Ради чего вы работаете?</h1>
      <Stack spacing={2}>
        <WorkTimeInput />
        <SalaryInput />
        {/* TODO: expenses form */}
        {/* TODO: results */}
      </Stack>
    </>
  );
};
