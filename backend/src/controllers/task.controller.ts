import { Request, Response } from 'express';
import { taskService } from '@/services/task.service';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '@/utils/task.validation';

// Явный тип параметров пути — фиксирует req.params.id как string,
// вместо дефолтного ParamsDictionary (string | string[])
interface TaskParams {
    id: string;
}

/**
 * Controller — тонкий слой: парсинг запроса, вызов Service, формирование ответа.
 * Никакой бизнес-логики и никаких прямых обращений к Prisma здесь быть не должно.
 */
class TaskController {
    async getAll(req: Request, res: Response): Promise<void> {
        const query = taskQuerySchema.parse(req.query);
        const tasks = await taskService.getTasks(query);
        res.status(200).json(tasks);
    }

    async getById(req: Request<TaskParams>, res: Response): Promise<void> {
        const task = await taskService.getTaskById(req.params.id);
        res.status(200).json(task);
    }

    async create(req: Request, res: Response): Promise<void> {
        const data = createTaskSchema.parse(req.body);
        const task = await taskService.createTask(data);
        res.status(201).json(task);
    }

    async update(req: Request<TaskParams>, res: Response): Promise<void> {
        const data = updateTaskSchema.parse(req.body);
        const task = await taskService.updateTask(req.params.id, data);
        res.status(200).json(task);
    }

    async toggleDone(req: Request<TaskParams>, res: Response): Promise<void> {
        const task = await taskService.toggleDone(req.params.id);
        res.status(200).json(task);
    }

    async delete(req: Request<TaskParams>, res: Response): Promise<void> {
        await taskService.deleteTask(req.params.id);
        res.status(204).send();
    }
}

export const taskController = new TaskController();