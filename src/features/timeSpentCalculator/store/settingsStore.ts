import dayjs, { type Dayjs } from 'dayjs';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type WorkTimeSettings = {
	startTime: Dayjs;
	endTime: Dayjs;
	lunchStartTime: Dayjs;
	lunchEndTime: Dayjs;
	includeLunch: boolean;
};

type SettingsState = {
	// Настройки рабочего времени
	workTime: WorkTimeSettings;
	// Зарплата
	salary: number;
	// Методы для обновления настроек
	updateWorkTime: (settings: Partial<WorkTimeSettings>) => void;
	updateSalary: (salary: number) => void;
	// Вычисляемые значения
	workHours: number;
};

// Функция для расчета рабочих часов
const calculateWorkHours = (settings: WorkTimeSettings): number => {
	const totalHours = settings.endTime.diff(settings.startTime, 'hour', true);

	if (settings.includeLunch) {
		const lunchHours = settings.lunchEndTime.diff(settings.lunchStartTime, 'hour', true);
		return Math.round((totalHours - lunchHours) * 10) / 10;
	}

	return Math.round(totalHours * 10) / 10;
};

// Функция для преобразования строк обратно в Dayjs объекты
const parseWorkTimeSettings = (data: unknown): WorkTimeSettings => {
	if (typeof data !== 'object' || data === null) {
		throw new Error('Invalid data');
	}

	const { startTime, endTime, lunchStartTime, lunchEndTime, includeLunch } = data as WorkTimeSettings;

	return {
		startTime: typeof startTime === 'string' ? dayjs(startTime) : startTime,
		endTime: typeof endTime === 'string' ? dayjs(endTime) : endTime,
		lunchStartTime: typeof lunchStartTime === 'string' ? dayjs(lunchStartTime) : lunchStartTime,
		lunchEndTime: typeof lunchEndTime === 'string' ? dayjs(lunchEndTime) : lunchEndTime,
		includeLunch,
	};
};

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set, _get) => ({
			workTime: {
				startTime: dayjs().set('hour', 9).set('minute', 0),
				endTime: dayjs().set('hour', 18).set('minute', 0),
				lunchStartTime: dayjs().set('hour', 13).set('minute', 0),
				lunchEndTime: dayjs().set('hour', 14).set('minute', 0),
				includeLunch: true,
			},
			salary: 150000,
			workHours: 8,

			updateWorkTime: settings => {
				set(state => {
					const newWorkTime = { ...state.workTime, ...settings };
					const updatedWorkTime = parseWorkTimeSettings(newWorkTime);

					return {
						...state,
						workTime: updatedWorkTime,
						workHours: calculateWorkHours(updatedWorkTime),
					};
				});
			},

			updateSalary: salary => {
				set(state => ({
					...state,
					salary,
				}));
			},
		}),
		{
			name: 'timespent-settings',
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => state => {
				// Преобразуем строки обратно в Dayjs объекты при восстановлении
				if (state) {
					state.workTime = parseWorkTimeSettings(state.workTime);
					state.workHours = calculateWorkHours(state.workTime);
				}
			},
		},
	),
);
