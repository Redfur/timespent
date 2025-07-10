import { Box, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateUUID } from '@/shared/lib/uuid';
import { Button } from '@/shared/ui/button';
import { TRANS_NS } from '../i18n';
import { useGroupsStore } from '../store/groupsStore';
import { type Group, SpentBy } from '../types';

const COLORS = [
	'#ff59d6', // розовый
	'#2fd96d', // зеленый
	'#ffb24f', // оранжевый
	'#4a90e2', // синий
	'#9c27b0', // фиолетовый
	'#f44336', // красный
	'#00bcd4', // голубой
	'#8bc34a', // светло-зеленый
	'#ff9800', // оранжевый
	'#795548', // коричневый
];

export const AddGroupForm = () => {
	const { t } = useTranslation(TRANS_NS);
	const { addGroup } = useGroupsStore();
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		color: COLORS[0],
	});

	const handleSubmit = () => {
		if (formData.name.trim()) {
			const newGroup: Group = {
				id: generateUUID(),
				name: formData.name.trim(),
				description: formData.description.trim(),
				color: formData.color,
				items: [
					{
						id: generateUUID(),
						name: '',
						spent: 0,
						spentBy: SpentBy.MONTH,
					},
				],
			};
			addGroup(newGroup);
			setFormData({ name: '', description: '', color: COLORS[0] });
			setOpen(false);
		}
	};

	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}>
				<Plus />
				{t('addGroup.button')}
			</Button>

			<Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>{t('addGroup.title')}</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
						<TextField
							label={t('addGroup.name')}
							value={formData.name}
							onChange={e => setFormData({ ...formData, name: e.target.value })}
							fullWidth
							required
						/>
						<TextField
							label={t('addGroup.description')}
							value={formData.description}
							onChange={e => setFormData({ ...formData, description: e.target.value })}
							fullWidth
							multiline
							rows={3}
						/>
						<Box>
							<Box sx={{ mb: 1 }}>{t('addGroup.color')}</Box>
							<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
								{COLORS.map(color => (
									<Box
										key={color}
										sx={{
											width: 32,
											height: 32,
											backgroundColor: color,
											borderRadius: '50%',
											cursor: 'pointer',
											border: formData.color === color ? '3px solid #000' : '1px solid #ccc',
											'&:hover': {
												border: '2px solid #000',
											},
										}}
										onClick={() => setFormData({ ...formData, color })}
									/>
								))}
							</Box>
						</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
					<Button onClick={handleSubmit} variant="default" disabled={!formData.name.trim()}>
						{t('addGroup.add')}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
