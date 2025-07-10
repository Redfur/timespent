import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateUUID } from '@/shared/lib/uuid';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
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

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{t('addGroup.title')}</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="group-name">{t('addGroup.name')}</Label>
							<Input
								id="group-name"
								value={formData.name}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setFormData({ ...formData, name: e.target.value })
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="group-description">{t('addGroup.description')}</Label>
							<Textarea
								id="group-description"
								value={formData.description}
								onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
									setFormData({ ...formData, description: e.target.value })
								}
								rows={3}
							/>
						</div>
						<div>
							<div className="mb-2">{t('addGroup.color')}</div>
							<div className="flex gap-2 flex-wrap">
								{COLORS.map(color => (
									<div
										role="button"
										tabIndex={0}
										onKeyDown={e => {
											if (e.key === 'Enter' || e.key === ' ') {
												setFormData({ ...formData, color });
											}
										}}
										key={color}
										className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
											formData.color === color ? 'border-black' : 'border-gray-300'
										} hover:border-black`}
										style={{ backgroundColor: color }}
										onClick={() => setFormData({ ...formData, color })}
									/>
								))}
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button onClick={() => setOpen(false)} variant="outline">
							{t('common.cancel')}
						</Button>
						<Button onClick={handleSubmit} disabled={!formData.name.trim()}>
							{t('addGroup.add')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
