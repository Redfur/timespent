import ClearIcon from '@mui/icons-material/Clear';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  useColorScheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TRANS_NS } from '../i18n';

export const ThemeChange = () => {
  const { mode, setMode } = useColorScheme();
  const { t } = useTranslation(TRANS_NS);
  return (
    <div>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={(_event, value) =>
          setMode(value as 'system' | 'light' | 'dark')
        }
      >
        <Tooltip title={t('system')}>
          <ToggleButton value="system" aria-label={t('system')}>
            <ClearIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={t('light')}>
          <ToggleButton value="light" aria-label={t('light')}>
            <LightModeIcon />
          </ToggleButton>
        </Tooltip>
        <Tooltip title={t('dark')}>
          <ToggleButton value="dark" aria-label={t('dark')}>
            <DarkModeIcon />
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    </div>
  );
};
