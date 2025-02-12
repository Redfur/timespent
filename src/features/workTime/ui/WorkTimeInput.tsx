import { FormControl, FormLabel } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

import { TRANS_KEY } from '../i18n';

type WorkTimeInputProps = {
  onChange: (value: Dayjs | null) => void;
  value: Dayjs | null;
};

export const WorkTimeInput = ({ onChange, value }: WorkTimeInputProps) => {
  const { t } = useTranslation(TRANS_KEY);
  return (
    <FormControl>
      <FormLabel>{t('title')}</FormLabel>
      <TimePicker value={value} onChange={onChange} />
    </FormControl>
  );
};
