import { create } from 'zustand';
import { generateUUID } from '~/shared/lib/uuid';
import { type Group, SpentBy, type SpentItem } from '../types';

type GroupsState = {
	groups: Group[];
	addGroup: (group: Group) => void;
	removeGroup: (id: string) => void;
	updateGroup: (id: string, group: Partial<Group>) => void;
	addSpentItem: (groupId: string) => void;
	removeSpentItem: (groupId: string, itemId: string) => void;
	updateSpentItem: (groupId: string, itemId: string, item: Partial<SpentItem>) => void;
};

// TODO: add i18n for default names
const DEFAULT_GROUPS: Group[] = [
	{
		id: generateUUID(),
		name: 'Квартира',
		color: '#ff59d6',
		description:
			'Аренда, коммуналка и все, что связано с хозяйством. Чем подробнее распишете, тем нагляднее будет результат.',
		items: [
			{
				id: generateUUID(),
				name: 'Съем квартиры',
				spent: 50000,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: 'Квартплата',
				spent: 5000,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: 'Клининг',
				spent: 5000,
				spentBy: SpentBy.MONTH,
			},
		],
	},
	{
		id: generateUUID(),
		name: 'Транспорт',
		color: '#2fd96d',
		description:
			'Как вы обычно добираетесь до работы? А за покупками? Если пользуетесь своей машиной, не забудьте добавить расходы на страховку, ТО и ремонт.',
		items: [
			{
				id: generateUUID(),
				name: 'Бензин',
				spent: 5000,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: 'Такси',
				spent: 5000,
				spentBy: SpentBy.MONTH,
			},
		],
	},
	{
		id: generateUUID(),
		name: 'Еда',
		color: '#ffb24f',
		description:
			'Все, что попадает из пункта А (магазин) в пункт Б (к столу) через пункт В (кухня). А также утренний кофе по дороге на работу, обеды в кафе и еда с доставкой.',
		items: [
			{
				id: generateUUID(),
				name: 'Продукты',
				spent: 25000,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: 'Кофе/кафе',
				spent: 300,
				spentBy: SpentBy.DAY,
			},
		],
	},
	{
		id: generateUUID(),
		name: 'Подписки',
		color: '#4a90e2',
		description:
			'Все цифровые и физические подписки: стриминги, облачные сервисы, журналы, фитнес-клубы и другие регулярные платежи.',
		items: [
			{
				id: generateUUID(),
				name: 'Netflix',
				spent: 799,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: 'Spotify',
				spent: 299,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: 'Фитнес-клуб',
				spent: 3000,
				spentBy: SpentBy.MONTH,
			},
		],
	},
	{
		id: generateUUID(),
		name: 'Развлечения',
		color: '#9c27b0',
		description: 'Кино, театры, концерты, игры, хобби и другие развлечения. Все, что делает жизнь интереснее.',
		items: [
			{
				id: generateUUID(),
				name: 'Кино/театр',
				spent: 1000,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: 'Игры',
				spent: 2000,
				spentBy: SpentBy.MONTH,
			},
		],
	},
	{
		id: generateUUID(),
		name: 'Здоровье',
		color: '#f44336',
		description: 'Медицинские услуги, лекарства, стоматология, страховка и другие расходы на здоровье.',
		items: [
			{
				id: generateUUID(),
				name: 'Стоматология',
				spent: 5000,
				spentBy: SpentBy.YEAR,
			},
			{
				id: generateUUID(),
				name: 'Лекарства',
				spent: 1000,
				spentBy: SpentBy.MONTH,
			},
		],
	},
];

export const useGroupsStore = create<GroupsState>((set, get) => ({
	groups: DEFAULT_GROUPS,
	addGroup: group => set(state => ({ groups: [...state.groups, group] })),
	removeGroup: id => set(state => ({ groups: state.groups.filter(group => group.id !== id) })),
	updateGroup: (id, group) =>
		set(state => ({
			groups: state.groups.map(g => (g.id === id ? { ...g, ...group } : g)),
		})),
	addSpentItem: (groupId: string) => {
		const state = get();
		const group = state.groups.find(g => g.id === groupId);
		if (group) {
			const newSpentItem = {
				id: generateUUID(),
				name: '',
				spent: 0,
				spentBy: SpentBy.MONTH,
			};
			set(state => ({
				groups: state.groups.map(g => (g.id === groupId ? { ...g, items: [...g.items, newSpentItem] } : g)),
			}));
		}
	},
	removeSpentItem: (groupId: string, itemId: string) => {
		const state = get();
		const group = state.groups.find(g => g.id === groupId);
		if (group) {
			set(state => ({
				groups: state.groups.map(g =>
					g.id === groupId ? { ...g, items: g.items.filter(item => item.id !== itemId) } : g,
				),
			}));
		}
	},
	updateSpentItem: (groupId: string, itemId: string, item: Partial<SpentItem>) => {
		const state = get();
		const group = state.groups.find(g => g.id === groupId);
		if (group) {
			set(state => ({
				groups: state.groups.map(g =>
					g.id === groupId
						? {
								...g,
								items: g.items.map(i => (i.id === itemId ? { ...i, ...item } : i)),
							}
						: g,
				),
			}));
		}
	},
}));
