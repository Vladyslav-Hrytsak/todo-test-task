import { z } from 'zod';

// Единая схема приоритета — переиспользуется в create и update,
// чтобы правило "1-10" не дублировалось в двух местах
const prioritySchema = z
    .number()
    .int('Priority must be an integer')
    .min(1, 'Priority must be at least 1')
    .max(10, 'Priority must be at most 10');

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    description: z.string().trim().max(2000).optional(),
    priority: prioritySchema.optional(),
    category: z.string().trim().max(50).optional(),
    dueDate: z.string().datetime({ message: 'dueDate must be a valid ISO date string' }).optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    done: z.boolean().optional(),
    priority: prioritySchema.optional(),
    category: z.string().trim().max(50).optional(),
    dueDate: z
        .union([z.string().datetime(), z.null()])
        .optional(),
});

export const taskQuerySchema = z.object({
    search: z.string().trim().optional(),
    status: z.enum(['all', 'done', 'undone']).optional(),
    sortBy: z.enum(['priority', 'createdAt', 'dueDate']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});