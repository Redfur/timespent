import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generateUUID } from '@/shared/lib/uuid';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { COLORS, ColorPicker, Form, FormField } from '@/shared/ui/form-fields';
import { TRANS_NS } from '../i18n';
import { type AddGroupFormData, addGroupSchema } from '../lib/validation/schemas';
import { useGroupsStore } from '../store/groupsStore';
import { type Group, SpentBy } from '../types';

const defaultValues: AddGroupFormData = {
	name: '',
	description: '',
	color: COLORS[0],
};

export const AddGroupForm = () => {
	const { t } = useTranslation(TRANS_NS);
	const { addGroup } = useGroupsStore();
	const [open, setOpen] = useState(false);

	const handleSubmit = (data: AddGroupFormData) => {
		const newGroup: Group = {
			id: generateUUID(),
			name: data.name.trim(),
			description: (data.description ?? '').trim(),
			color: data.color,
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
		setOpen(false);
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
					<Form schema={addGroupSchema} defaultValues={defaultValues} onSubmit={handleSubmit} className="space-y-4">
						<FormField name="name" label={t('addGroup.name')} required />
						<FormField name="description" label={t('addGroup.description')} type="textarea" />
						<ColorPicker name="color" label={t('addGroup.color')} />
						<DialogFooter>
							<Button type="button" onClick={() => setOpen(false)} variant="outline">
								{t('common.cancel')}
							</Button>
							<Button type="submit">{t('addGroup.add')}</Button>
						</DialogFooter>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
};
