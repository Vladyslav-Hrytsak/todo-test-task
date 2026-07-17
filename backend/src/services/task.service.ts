import { Task } from '@prisma/client';
import { taskRepository } from '@/repositories/task.repository';
import { CreateTaskDTO, UpdateTaskDTO, TaskQueryOptions } from '@/types/task.types';
import { NotFoundError } from '@/utils/errors';

/**
 * TaskService — бизнес-логика приложения.
 * Не знает о HTTP (req/res) и не знает о Prisma напрямую — только о Repository.
 * Валидация формата данных (Zod) происходит на уровне Controller,
 * здесь — только бизнес-инварианты (например, "задача должна существовать").
 */
class TaskService {
    async getTasks(options: TaskQueryOptions): Promise<Task[]> {
        return taskRepository.findAll(options);
    }

    async getTaskById(id: string): Promise<Task> {
        const task = await taskRepository.findById(id);
        if (!task) {
            throw new NotFoundError('Task', id);
        }
        return task;
    }

    async createTask(data: CreateTaskDTO): Promise<Task> {
        return taskRepository.create(data);
    }

    async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
        // Проверяем существование до update — иначе Prisma бросит P2025
        // с невнятным для клиента сообщением вместо чистого 404
        const exists = await taskRepository.exists(id);
        if (!exists) {
            throw new NotFoundError('Task', id);
        }
        return taskRepository.update(id, data);
    }

    async deleteTask(id: string): Promise<void> {
        const exists = await taskRepository.exists(id);
        if (!exists) {
            throw new NotFoundError('Task', id);
        }
        await taskRepository.delete(id);
    }

    async toggleDone(id: string): Promise<Task> {
        const task = await this.getTaskById(id);
        return taskRepository.update(id, { done: !task.done });
    }
}

export const taskService = new TaskService();