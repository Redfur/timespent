import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
			<Typography variant="h3" component="h1" marginTop={16} marginBottom={8}>
				{t('main.title')}
			</Typography>
			<Stack spacing={3}>
				<WorkTimeInput />
				<SalaryInput />

				<Card>
					<CardHeader title={t('main.expensesByGroups')} />
					<CardContent>
						<Stack spacing={2}>
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
						</Stack>
					</CardContent>
				</Card>

				<WorkDayProgress salary={salary} workTime={workTime} workHours={workHours} />
			</Stack>
		</>
	);
};
