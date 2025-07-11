/**
 * Преобразует dayjs объект в строку времени для input[type="time"]
 */
export const dayjsToTimeString = (dayjs: any): string => {
	if (!dayjs || typeof dayjs.format !== 'function') {
		return '';
	}
	return dayjs.format('HH:mm');
};

/**
 * Преобразует строку времени в dayjs объект
 */
export const timeStringToDayjs = (timeString: string, baseDayjs: any) => {
	if (!timeString || !baseDayjs) {
		return baseDayjs;
	}

	const [hours, minutes] = timeString.split(':').map(Number);
	return baseDayjs.hour(hours).minute(minutes);
};

/**
 * Валидация времени (начало должно быть раньше конца)
 */
export const validateTimeRange = (startTime: string, endTime: string): boolean => {
	if (!startTime || !endTime) return true;

	const [startHours, startMinutes] = startTime.split(':').map(Number);
	const [endHours, endMinutes] = endTime.split(':').map(Number);

	const startTotal = startHours * 60 + startMinutes;
	const endTotal = endHours * 60 + endMinutes;

	return startTotal < endTotal;
};

/**
 * Форматирует число как валюту
 */
export const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		minimumFractionDigits: 0,
	}).format(value);
};

/**
 * Парсит валюту в число
 */
export const parseCurrency = (value: string): number => {
	const cleaned = value.replace(/[^\d]/g, '');
	return cleaned ? Number(cleaned) : 0;
};
