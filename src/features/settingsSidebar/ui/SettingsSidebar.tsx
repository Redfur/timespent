import { Box, Container, Drawer, Typography } from '@mui/material';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/ui/button';
import { LanguageChange } from '@/widgets/languageChange';
import { ThemeChange } from '@/widgets/themeChange';
import { TRANS_NS } from '../i18n';

export const SettingsSidebar = () => {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation(TRANS_NS);

	return (
		<>
			<Button onClick={() => setOpen(true)}>
				<Menu />
				{t('title')}
			</Button>
			<Drawer keepMounted={false} open={open} onClose={() => setOpen(false)} anchor="right">
				<Box sx={{ width: 300 }}>
					<Container>
						<Typography variant="h5" gutterBottom>
							{t('title')}
						</Typography>

						<Box sx={{ mb: 3 }}>
							<Typography variant="h6" gutterBottom>
								{t('theme')}
							</Typography>
							<ThemeChange />
						</Box>

						<Box sx={{ mb: 3 }}>
							<Typography variant="h6" gutterBottom>
								{t('language')}
							</Typography>
							<LanguageChange />
						</Box>
					</Container>
				</Box>
			</Drawer>
		</>
	);
};
