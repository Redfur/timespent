import { z } from 'zod';

// Схема для добавления новой группы расходов
export const addGroupSchema = z.object({
	name: z.string().min(1, 'Название обязательно'),
	description: z.string().optional(),
	color: z.string().min(1, 'Цвет обязателен'),
});

// Схема для настроек рабочего времени
export const workTimeSchema = z.object({
	startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени'),
	endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени'),
	lunchStartTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени'),
	lunchEndTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Неверный формат времени'),
	includeLunch: z.boolean(),
});

// Схема для статьи расхода
export const spentItemSchema = z.object({
	name: z.string().min(1, 'Название расхода обязательно'),
	spent: z.number().min(0, 'Сумма должна быть положительной'),
	spentBy: z.enum(['day', 'month', 'year']),
});

// Схема для группы расходов
export const groupSchema = z.object({
	name: z.string().min(1, 'Название группы обязательно'),
	description: z.string().optional(),
	color: z.string().min(1, 'Цвет обязателен'),
	items: z.array(spentItemSchema),
});

// Схема для зарплаты
export const salarySchema = z.object({
	salary: z.number().min(0, 'Зарплата должна быть положительной'),
});

// Типы для TypeScript
export type AddGroupFormData = z.infer<typeof addGroupSchema>;
export type WorkTimeFormData = z.infer<typeof workTimeSchema>;
export type SpentItemFormData = z.infer<typeof spentItemSchema>;
export type GroupFormData = z.infer<typeof groupSchema>;
export type SalaryFormData = z.infer<typeof salarySchema>;
