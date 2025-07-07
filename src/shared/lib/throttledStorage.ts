// Throttled storage для отложенного сохранения в localStorage
export const createThrottledStorage = (delay = 500) => {
	let timeoutId: NodeJS.Timeout | null = null;
	let pendingData: string | null = null;

	return {
		getItem: (name: string): string | null => {
			return localStorage.getItem(name);
		},
		setItem: (name: string, value: string): void => {
			// Отменяем предыдущий таймаут
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			// Сохраняем данные для записи
			pendingData = value;

			// Устанавливаем новый таймаут
			timeoutId = setTimeout(() => {
				if (pendingData !== null) {
					localStorage.setItem(name, pendingData);
					pendingData = null;
				}
			}, delay);
		},
		removeItem: (name: string): void => {
			// Отменяем отложенную запись
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
			pendingData = null;
			localStorage.removeItem(name);
		},
	};
};
