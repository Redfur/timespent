import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  useColorScheme,
} from '@mui/material';

export const ThemeChange = () => {
  const { mode, setMode } = useColorScheme();
  return (
    <div>
      <FormControl>
        <RadioGroup
          aria-label="theme"
          name="theme-toggle"
          row
          value={mode}
          onChange={event =>
            setMode(event.target.value as 'system' | 'light' | 'dark')
          }
        >
          <FormControlLabel value="system" control={<Radio />} label="System" />
          <FormControlLabel value="light" control={<Radio />} label="Light" />
          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
        </RadioGroup>
      </FormControl>
    </div>
  );
};
