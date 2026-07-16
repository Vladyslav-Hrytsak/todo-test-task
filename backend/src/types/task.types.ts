import { Task } from '@prisma/client';

// Реэкспорт Prisma-типа — единый источник правды для сущности Task.
// Эти же поля будут зеркалированы во frontend/types/task.ts (см. шаг 5),
// так как без npm workspaces/monorepo tooling нет способа шарить типы
// напрямую между backend и frontend — сознательный trade-off для scope теста.
export type { Task };

export type TaskStatus = 'all' | 'done' | 'undone';
export type SortField = 'priority' | 'createdAt' | 'dueDate';
export type SortOrder = 'asc' | 'desc';

// DTO для создания — id/createdAt/updatedAt генерируются сервером
export interface CreateTaskDTO {
    title: string;
    description?: string;
    priority?: number;
    category?: string;
    dueDate?: string; // ISO string на входе, конвертируется в Date на Service-слое
}

// DTO для обновления — все поля опциональны (partial update)
export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    done?: boolean;
    priority?: number;
    category?: string;
    dueDate?: string | null;
}

// Query-параметры для GET /tasks — маппятся из req.query в контроллере
export interface TaskQueryOptions {
    search?: string;
    status?: TaskStatus;
    sortBy?: SortField;
    sortOrder?: SortOrder;
}