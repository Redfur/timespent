import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers';
import dayjs, { type Dayjs } from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TRANS_NS } from '../i18n';

export const WorkTimeInput = () => {
  const { t } = useTranslation(TRANS_NS);
  const [startTime, setStartTime] = useState<Dayjs>(
    dayjs().set('hour', 9).set('minute', 0),
  );
  const [endTime, setEndTime] = useState<Dayjs>(
    dayjs().set('hour', 17).set('minute', 0),
  );

  const workHours = endTime.diff(startTime, 'hour');

  return (
    <Card raised>
      <CardHeader
        title={
          workHours > 0
            ? `${t('title')} - ${t('hours', {
                count: workHours,
                ns: 'common',
              })}`
            : t('title')
        }
      />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TimeField
            label={t('startTime')}
            format="HH:mm"
            maxTime={endTime}
            value={startTime}
            fullWidth
            onChange={d => setStartTime(d || dayjs('09:00'))}
          />
          <TimeField
            label={t('endTime')}
            format="HH:mm"
            minTime={startTime}
            value={endTime}
            fullWidth
            onChange={d => setEndTime(d || dayjs('17:00'))}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
