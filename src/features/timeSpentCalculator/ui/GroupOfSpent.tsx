import {
	Box,
	Card,
	CardContent,
	CardHeader,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from '@mui/material';
import { Plus, RussianRuble, Trash } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { TRANS_NS } from '../i18n';
import { useGroupsStore } from '../store/groupsStore';
import type { SpentBy, SpentItem } from '../types';
import { PeriodSelector } from './PeriodSelector';

interface GroupOfSpentProps {
	id: string;
	color: string;
	name: string;
	description: string;
	items: SpentItem[];
}

export const GroupOfSpent = ({ id, color, name, description, items }: GroupOfSpentProps) => {
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
						<Button
							onClick={() => setShowDeleteDialog(true)}
							size="icon"
							variant="destructive"
							title={t('deleteGroup.button')}
						>
							<Trash />
						</Button>
					}
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
						{description}
					</Typography>
					<div className="space-y-4">
						{items.map(item => (
							<div key={item.id} className="flex items-center gap-4">
								<Input
									placeholder={t('main.expenseName')}
									value={item.name}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeName(item.id, e.target.value)}
									className="flex-1"
								/>
								<div className="relative w-40">
									<RussianRuble className="absolute left-2 top-1/2 size-4 transform -translate-y-1/2 pointer-events-none" />
									<Input
										placeholder={t('main.expenseAmount')}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											handleChangeSpent(item.id, Number(e.target.value) || 0)
										}
										value={item.spent}
										className="pl-8"
									/>
								</div>
								<PeriodSelector value={item.spentBy} onChange={period => handleChangePeriod(item.id, period)} />
								<Button onClick={() => removeSpentItem(id, item.id)} size="icon" variant="destructive">
									<Trash />
								</Button>
							</div>
						))}
						<Button onClick={() => addSpentItem(id)} variant="outline" size="sm">
							<Plus />
							{t('main.addExpense')}
						</Button>
					</div>
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
					<Button onClick={handleDeleteGroup} variant="destructive">
						{t('deleteGroup.confirm')}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
