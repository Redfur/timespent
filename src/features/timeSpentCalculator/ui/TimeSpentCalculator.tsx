import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Typography } from '@/shared/ui/typography';
import { TRANS_NS } from '../i18n';
import { useGroupsStore } from '../store/groupsStore';
import { useSettingsStore } from '../store/settingsStore';
import { AddGroupForm } from './AddGroupForm';
import { GroupOfSpent } from './GroupOfSpent';
import { SalaryInput } from './SalaryInput';
import { WorkDayProgress } from './WorkDayProgress';
import { WorkTimeInput } from './WorkTimeInput';

export const TimeSpentCalculator = () => {
	const { t } = useTranslation(TRANS_NS);
	const { groups } = useGroupsStore();
	const { salary, workTime, workHours } = useSettingsStore();

	return (
		<>
			<Typography variant="h3" component="h1" className="mb-8">
				{t('main.title')}
			</Typography>
			<div className="space-y-4">
				<WorkTimeInput />
				<SalaryInput />

				<Card className="gap-4">
					<CardHeader>
						<CardTitle>{t('main.expensesByGroups')}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{groups.map(group => (
								<GroupOfSpent
									key={group.id}
									id={group.id}
									name={group.name}
									color={group.color}
									description={group.description}
									items={group.items}
								/>
							))}
							<AddGroupForm />
						</div>
					</CardContent>
				</Card>

				<WorkDayProgress salary={salary} workTime={workTime} workHours={workHours} />
			</div>
		</>
	);
};
