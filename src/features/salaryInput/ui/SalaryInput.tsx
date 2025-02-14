import {
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TRANS_NS } from '../i18n';

const formatCurrency = (value: string) => {
  const cleanedString = value.trim().replace(/\D/g, '');
  const formattedString = cleanedString.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return formattedString;
};

export const SalaryInput = () => {
  const { t } = useTranslation(TRANS_NS);
  const [salary, setSalary] = useState('50000');
  const salaryNumber = Number(salary.replace(/\s/g, ''));
  return (
    <Card raised>
      <CardHeader title={t('title')} />
      <CardContent>
        <Typography mb={2}>{t('description')}</Typography>
        <TextField
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">&#8381;</InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {t('rubles_a_month', {
                    count: salaryNumber,
                  })}
                </InputAdornment>
              ),
            },
          }}
          inputMode="numeric"
          placeholder="50 000"
          autoComplete="off"
          value={salary}
          onChange={e => setSalary(formatCurrency(e.target.value))}
          fullWidth
        />
      </CardContent>
    </Card>
  );
};
