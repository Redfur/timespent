import { AddOutlined, Delete } from '@mui/icons-material';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TRANS_NS } from '../i18n';
import { useGroupsStore } from '../store/groupsStore';
import type { SpentBy, SpentItem } from '../types';
import { AddGroupForm } from './AddGroupForm';
import { PeriodSelector } from './PeriodSelector';
import { SalaryInput } from './SalaryInput';
import { WorkDayProgress } from './WorkDayProgress';
import { WorkTimeInput } from './WorkTimeInput';

const GroupOfSpent = ({
	id,
	color,
	name,
	description,
	items,
}: {
	id: string;
	color: string;
	name: string;
	description: string;
	items: SpentItem[];
}) => {
	const { t } = useTranslation(TRANS_NS);
	const { addSpentItem, removeSpentItem, updateSpentItem, removeGroup } = useGroupsStore();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleChangeName = (spentId: string, name: string) => {
		updateSpentItem(id, spentId, { name });
	};

	const handleChangeSpent = (spentId: string, spent: number) => {
		updateSpentItem(id, spentId, { spent });
	};

	const handleChangePeriod = (spentId: string, period: string) => {
		updateSpentItem(id, spentId, { spentBy: period as SpentBy });
	};

	const handleDeleteGroup = () => {
		removeGroup(id);
		setShowDeleteDialog(false);
	};

	return (
		<>
			<Card sx={{ mb: 2 }}>
				<CardHeader
					title={
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
							<Box
								sx={{
									width: 20,
									height: 20,
									backgroundColor: color,
									borderRadius: '50%',
								}}
							/>
							{name}
						</Box>
					}
					action={
						<IconButton
							onClick={() => setShowDeleteDialog(true)}
							size="small"
							color="error"
							title={t('deleteGroup.button')}
						>
							<Delete />
						</IconButton>
					}
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						{description}
					</Typography>
					<Stack spacing={2}>
						{items.map(item => (
							<Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
								<TextField
									placeholder="Название"
									variant="standard"
									value={item.name}
									onChange={e => handleChangeName(item.id, e.target.value)}
									sx={{ flex: 1 }}
								/>
								<TextField
									placeholder="Сумма"
									variant="standard"
									onChange={e => handleChangeSpent(item.id, Number(e.target.value) || 0)}
									slotProps={{
										input: {
											startAdornment: <InputAdornment position="start">&#8381;</InputAdornment>,
										},
									}}
									value={item.spent}
									sx={{ width: 150 }}
								/>
								<PeriodSelector value={item.spentBy} onChange={period => handleChangePeriod(item.id, period)} />
								<IconButton onClick={() => removeSpentItem(id, item.id)} size="small">
									<Delete />
								</IconButton>
							</Box>
						))}
						<Button onClick={() => addSpentItem(id)} startIcon={<AddOutlined />} variant="outlined" size="small">
							Добавить расход
						</Button>
					</Stack>
				</CardContent>
			</Card>

			{/* Диалог подтверждения удаления группы */}
			<Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
				<DialogTitle>{t('deleteGroup.confirmTitle')}</DialogTitle>
				<DialogContent>
					<Typography>{t('deleteGroup.confirmMessage', { name })}</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowDeleteDialog(false)}>{t('deleteGroup.cancel')}</Button>
					<Button onClick={handleDeleteGroup} color="error" variant="contained">
						{t('deleteGroup.confirm')}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export const TimeSpentCalculator = () => {
	const { groups } = useGroupsStore();
	const [salary, setSalary] = useState(50000);
	const [workHours, setWorkHours] = useState(8);

	return (
		<>
			<Typography variant="h3" component="h1" gutterBottom>
				Ради чего вы работаете?
			</Typography>
			<Stack spacing={3}>
				<WorkTimeInput onHoursChange={setWorkHours} />
				<SalaryInput onSalaryChange={setSalary} />

				<Card>
					<CardHeader title="Расходы по группам" />
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

				<WorkDayProgress salary={salary} workHours={workHours} />
			</Stack>
		</>
	);
};
