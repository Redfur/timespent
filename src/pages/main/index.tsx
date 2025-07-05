import { Box, Container } from '@mui/material';
import { SettingsSidebar } from '~/features/settingsSidebar/ui/SettingsSidebar';
import { TimeSpentCalculator } from '~/features/timeSpentCalculator';

export const MainPage = () => {
	return (
		<Container maxWidth="md">
			<Box sx={{ position: 'absolute', top: 8, right: 8 }}>
				<SettingsSidebar />
			</Box>
			<TimeSpentCalculator />
		</Container>
	);
};
