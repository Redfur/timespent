import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { LanguageChange } from '@/widgets/languageChange';
import { ThemeChange } from '@/widgets/themeChange';
import { TRANS_NS } from '../i18n';

export const SettingsSidebar = () => {
	const { t } = useTranslation(TRANS_NS);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>
					<Menu />
					{t('title')}
				</Button>
			</SheetTrigger>
			<SheetContent side="right" className="w-80">
				<SheetHeader>
					<SheetTitle>{t('title')}</SheetTitle>
				</SheetHeader>

				<SheetDescription>
					<div className="space-y-6 px-4">
						<div className="space-y-2">
							<h3 className="text-md font-semibold">{t('theme')}</h3>
							<ThemeChange />
						</div>

						<div className="space-y-2">
							<h3 className="text-md font-semibold">{t('language')}</h3>
							<LanguageChange />
						</div>
					</div>
				</SheetDescription>
			</SheetContent>
		</Sheet>
	);
};
