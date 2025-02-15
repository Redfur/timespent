import MenuIcon from '@mui/icons-material/Menu';
import { Box, Button, Container, Drawer } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeChange } from '~/widgets/themeChange';
import { TRANS_NS } from '../i18n';

export const SettingsSidebar = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(TRANS_NS);

  return (
    <>
      <Button startIcon={<MenuIcon />} onClick={() => setOpen(true)}>
        {t('title')}
      </Button>
      <Drawer
        keepMounted={false}
        open={open}
        onClose={() => setOpen(false)}
        anchor="right"
      >
        <Box sx={{ width: 300 }}>
          <Container>
            <h2>{t('title')}</h2>
            <ThemeChange />
          </Container>
        </Box>
      </Drawer>
    </>
  );
};
