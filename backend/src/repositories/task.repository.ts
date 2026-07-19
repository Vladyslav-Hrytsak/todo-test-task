import { Prisma, Task } from '@prisma/client';
import { prisma } from '@/config/prisma';
import { CreateTaskDTO, UpdateTaskDTO, TaskQueryOptions } from '@/types/task.types';

class TaskRepository {
    private buildWhereClause(options: TaskQueryOptions): Prisma.TaskWhereInput {
        const where: Prisma.TaskWhereInput = {};

        if (options.status === 'done') {
            where.done = true;
        } else if (options.status === 'undone') {
            where.done = false;
        }

        if (options.search && options.search.trim() !== '') {
            where.OR = [
                { title: { contains: options.search, mode: 'insensitive' } },
                { description: { contains: options.search, mode: 'insensitive' } },
            ];
        }

        return where;
    }

    private buildOrderByClause(options: TaskQueryOptions): Prisma.TaskOrderByWithRelationInput {
        const sortBy = options.sortBy ?? 'createdAt';
        const sortOrder = options.sortOrder ?? 'desc';
        return { [sortBy]: sortOrder };
    }

    async findAll(options: TaskQueryOptions = {}): Promise<Task[]> {
        return prisma.task.findMany({
            where: this.buildWhereClause(options),
            orderBy: this.buildOrderByClause(options),
        });
    }

    async findById(id: string): Promise<Task | null> {
        return prisma.task.findUnique({ where: { id } });
    }

    async create(data: CreateTaskDTO): Promise<Task> {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                priority: data.priority ?? 5,
                category: data.category,
                dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            },
        });
    }

    async update(id: string, data: UpdateTaskDTO): Promise<Task> {
        return prisma.task.update({
            where: { id },
            data: {
                ...data,
                dueDate:
                    data.dueDate === undefined
                        ? undefined
                        : data.dueDate === null
                            ? null
                            : new Date(data.dueDate),
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.task.delete({ where: { id } });
    }

    async exists(id: string): Promise<boolean> {
        const count = await prisma.task.count({ where: { id } });
        return count > 0;
    }
}

export const taskRepository = new TaskRepository();