// Зеркалирует backend/src/types/task.types.ts.
// Без monorepo-tooling (npm workspaces / turborepo) нет способа шарить типы
// напрямую между отдельными репозиториями backend/frontend — осознанный
// trade-off ради простоты для scope тестового задания.

export interface Task {
    id: string;
    title: string;
    description: string | null;
    done: boolean;
    priority: number;
    category: string | null;
    dueDate: string | null; // приходит с backend как ISO string (JSON не знает Date)
    createdAt: string;
    updatedAt: string;
}

export type TaskStatus = 'all' | 'done' | 'undone';
export type SortField = 'priority' | 'createdAt' | 'dueDate';
export type SortOrder = 'asc' | 'desc';

export interface CreateTaskPayload {
    title: string;
    description?: string;
    priority?: number;
    category?: string;
    dueDate?: string;
}

export interface UpdateTaskPayload {
    title?: string;
    description?: string;
    done?: boolean;
    priority?: number;
    category?: string;
    dueDate?: string | null;
}

export interface TaskQueryParams {
    search?: string;
    status?: TaskStatus;
    sortBy?: SortField;
    sortOrder?: SortOrder;
}