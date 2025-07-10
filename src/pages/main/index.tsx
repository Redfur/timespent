import { SettingsSidebar } from '@/features/settingsSidebar/ui/SettingsSidebar';
import { TimeSpentCalculator } from '@/features/timeSpentCalculator';

export const MainPage = () => {
	return (
		<div className="max-w-2xl mx-auto pt-16 pb-16">
			<div className="fixed top-8 right-8">
				<SettingsSidebar />
			</div>
			<TimeSpentCalculator />
		</div>
	);
};
