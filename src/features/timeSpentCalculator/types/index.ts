enum SpentBy {
	MONTH = 'month',
	YEAR = 'year',
	DAY = 'day',
}

type Group = {
	id: string;
	name: string;
	color: string;
	description: string;
	items: SpentItem[];
};

type SpentItem = {
	id: string;
	name: string;
	spent: number;
	spentBy: SpentBy;
};

export { SpentBy, type Group, type SpentItem };
