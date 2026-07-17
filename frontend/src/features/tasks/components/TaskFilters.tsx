'use client';

import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { TaskQueryParams, TaskStatus, SortField, SortOrder } from '../types/task.types';

interface TaskFiltersProps {
    filters: TaskQueryParams;
    onChange: (filters: TaskQueryParams) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
    return (
        <div className="flex flex-wrap gap-3">
            <Input
                placeholder="Search tasks..."
                value={filters.search ?? ''}
                onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
                className="max-w-xs"
            />

            <Select
                value={filters.status ?? 'all'}
                onValueChange={(value) => {
                    // Base UI может отдать null при программном сбросе — в нашем UI
                    // такого не бывает (Select всегда имеет значение), но типобезопасно
                    // откатываемся на дефолт 'all', если это всё же произойдёт
                    if (value) onChange({ ...filters, status: value as TaskStatus });
                }}
            >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All tasks</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="undone">Undone</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.sortBy ?? 'createdAt'}
                onValueChange={(value) => {
                    if (value) onChange({ ...filters, sortBy: value as SortField });
                }}
            >
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdAt">Date created</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="dueDate">Due date</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.sortOrder ?? 'desc'}
                onValueChange={(value) => {
                    if (value) onChange({ ...filters, sortOrder: value as SortOrder });
                }}
            >
                <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}