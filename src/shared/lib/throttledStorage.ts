// Throttled storage для отложенного сохранения в localStorage
export const createThrottledStorage = (delay = 500) => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let pendingName: string | null = null;
	let pendingData: string | null = null;

	// Досылает отложенную запись синхронно (например, перед уходом со страницы)
	const flush = (): void => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
		if (pendingName !== null && pendingData !== null) {
			localStorage.setItem(pendingName, pendingData);
			pendingName = null;
			pendingData = null;
		}
	};

	if (typeof window !== 'undefined') {
		window.addEventListener('beforeunload', flush);
		window.addEventListener('pagehide', flush);
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				flush();
			}
		});
	}

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
			pendingName = name;
			pendingData = value;

			// Устанавливаем новый таймаут
			timeoutId = setTimeout(flush, delay);
		},
		removeItem: (name: string): void => {
			// Отменяем отложенную запись
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}
			pendingName = null;
			pendingData = null;
			localStorage.removeItem(name);
		},
	};
};
