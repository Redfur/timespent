import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { generateUUID } from '~/shared/lib/uuid';
import { type Group, SpentBy, type SpentItem } from '../types';

// Функция для получения переведенных групп
const getTranslatedGroups = (t: (key: string) => string): Group[] => [
	{
		id: generateUUID(),
		name: t('groups.apartment'),
		color: '#ff59d6',
		description: t('groups.apartment.description'),
		items: [
			{
				id: generateUUID(),
				name: t('groups.rent'),
				spent: 50000,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: t('groups.utilities'),
				spent: 5000,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: t('groups.cleaning'),
				spent: 5000,
				spentBy: SpentBy.MONTH,
			},
		],
	},
	{
		id: generateUUID(),
		name: t('groups.transport'),
		color: '#2fd96d',
		description: t('groups.transport.description'),
		items: [
			{
				id: generateUUID(),
				name: t('groups.gasoline'),
				spent: 5000,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: t('groups.taxi'),
				spent: 5000,
				spentBy: SpentBy.MONTH,
			},
		],
	},
	{
		id: generateUUID(),
		name: t('groups.food'),
		color: '#ffb24f',
		description: t('groups.food.description'),
		items: [
			{
				id: generateUUID(),
				name: t('groups.products'),
				spent: 25000,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: t('groups.coffee'),
				spent: 300,
				spentBy: SpentBy.DAY,
			},
		],
	},
	{
		id: generateUUID(),
		name: t('groups.subscriptions'),
		color: '#4a90e2',
		description: t('groups.subscriptions.description'),
		items: [
			{
				id: generateUUID(),
				name: t('groups.netflix'),
				spent: 799,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: t('groups.spotify'),
				spent: 299,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: t('groups.gym'),
				spent: 3000,
				spentBy: SpentBy.MONTH,
			},
		],
	},
	{
		id: generateUUID(),
		name: t('groups.entertainment'),
		color: '#9c27b0',
		description: t('groups.entertainment.description'),
		items: [
			{
				id: generateUUID(),
				name: t('groups.cinema'),
				spent: 1000,
				spentBy: SpentBy.MONTH,
			},
			{
				id: generateUUID(),
				name: t('groups.games'),
				spent: 2000,
				spentBy: SpentBy.MONTH,
			},
		],
	},
	{
		id: generateUUID(),
		name: t('groups.health'),
		color: '#f44336',
		description: t('groups.health.description'),
		items: [
			{
				id: generateUUID(),
				name: t('groups.dentistry'),
				spent: 5000,
				spentBy: SpentBy.YEAR,
			},
			{
				id: generateUUID(),
				name: t('groups.medicine'),
				spent: 1000,
				spentBy: SpentBy.MONTH,
			},
		],
	},
];

type GroupsState = {
	groups: Group[];
	addGroup: (group: Group) => void;
	removeGroup: (id: string) => void;
	updateGroup: (id: string, group: Partial<Group>) => void;
	addSpentItem: (groupId: string) => void;
	removeSpentItem: (groupId: string, itemId: string) => void;
	updateSpentItem: (groupId: string, itemId: string, item: Partial<SpentItem>) => void;
};

export const useGroupsStore = create<GroupsState>()(
	persist(
		(set, get) => ({
			groups: [],
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
		}),
		{
			name: 'timespent-groups',
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => state => {
				// Если нет сохраненных групп, создаем группы по умолчанию
				if (state && state.groups.length === 0) {
					// Получаем текущий язык из i18n
					const currentLanguage = localStorage.getItem('timespent-language') || 'ru';
					const t = (key: string) => {
						// Простая функция перевода для инициализации
						const translations: Record<string, Record<string, string>> = {
							ru: {
								'groups.apartment': 'Квартира',
								'groups.rent': 'Съем квартиры',
								'groups.utilities': 'Квартплата',
								'groups.cleaning': 'Клининг',
								'groups.transport': 'Транспорт',
								'groups.gasoline': 'Бензин',
								'groups.taxi': 'Такси',
								'groups.food': 'Еда',
								'groups.products': 'Продукты',
								'groups.coffee': 'Кофе',
								'groups.subscriptions': 'Подписки',
								'groups.netflix': 'Netflix',
								'groups.spotify': 'Spotify',
								'groups.gym': 'Спортзал',
								'groups.entertainment': 'Развлечения',
								'groups.cinema': 'Кино',
								'groups.games': 'Игры',
								'groups.health': 'Здоровье',
								'groups.dentistry': 'Стоматология',
								'groups.medicine': 'Лекарства',
								'groups.apartment.description':
									'Аренда, коммуналка и все, что связано с хозяйством. Чем подробнее распишете, тем нагляднее будет результат.',
								'groups.transport.description':
									'Как вы обычно добираетесь до работы? А за покупками? Если пользуетесь своей машиной, не забудьте добавить расходы на страховку, ТО и ремонт.',
								'groups.food.description':
									'Все, что попадает из пункта А (магазин) в пункт Б (к столу) через пункт В (кухня). А также утренний кофе по дороге на работу, обеды в кафе и еда с доставкой.',
								'groups.subscriptions.description':
									'Все цифровые и физические подписки: стриминги, облачные сервисы, журналы, фитнес-клубы и другие регулярные платежи.',
								'groups.entertainment.description':
									'Кино, театры, концерты, игры, хобби и другие развлечения. Все, что делает жизнь интереснее.',
								'groups.health.description':
									'Медицинские услуги, лекарства, стоматология, страховка и другие расходы на здоровье.',
							},
							en: {
								'groups.apartment': 'Apartment',
								'groups.rent': 'Rent',
								'groups.utilities': 'Utilities',
								'groups.cleaning': 'Cleaning',
								'groups.transport': 'Transport',
								'groups.gasoline': 'Gasoline',
								'groups.taxi': 'Taxi',
								'groups.food': 'Food',
								'groups.products': 'Products',
								'groups.coffee': 'Coffee',
								'groups.subscriptions': 'Subscriptions',
								'groups.netflix': 'Netflix',
								'groups.spotify': 'Spotify',
								'groups.gym': 'Gym',
								'groups.entertainment': 'Entertainment',
								'groups.cinema': 'Cinema',
								'groups.games': 'Games',
								'groups.health': 'Health',
								'groups.dentistry': 'Dentistry',
								'groups.medicine': 'Medicine',
								'groups.apartment.description':
									'Rent, utilities and everything related to household. The more detailed you write, the more visual the result will be.',
								'groups.transport.description':
									"How do you usually get to work? And for shopping? If you use your own car, don't forget to add insurance, maintenance and repair costs.",
								'groups.food.description':
									'Everything that goes from point A (store) to point B (table) through point C (kitchen). As well as morning coffee on the way to work, lunches in cafes and food delivery.',
								'groups.subscriptions.description':
									'All digital and physical subscriptions: streaming, cloud services, magazines, gyms and other regular payments.',
								'groups.entertainment.description':
									'Movies, theaters, concerts, games, hobbies and other entertainment. Everything that makes life more interesting.',
								'groups.health.description':
									'Medical services, medicines, dentistry, insurance and other health expenses.',
							},
						};
						return translations[currentLanguage as keyof typeof translations]?.[key] || key;
					};

					const defaultGroups = getTranslatedGroups(t);
					state.groups = defaultGroups;
				}
			},
		},
	),
);
