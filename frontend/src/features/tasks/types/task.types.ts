export interface Task {
    id: string;
    title: string;
    description: string | null;
    done: boolean;
    priority: number;
    category: string | null;
    dueDate: string | null;
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