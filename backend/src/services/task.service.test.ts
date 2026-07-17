import { taskService } from '@/services/task.service';
import { taskRepository } from '@/repositories/task.repository';
import { NotFoundError } from '@/utils/errors';
import { Task } from '@prisma/client';

// Мокаем весь модуль репозитория — Service тестируется в полной изоляции от Prisma/БД.
// Это юнит-тест: проверяем только бизнес-логику (существование, toggle),
// а не то, правильно ли Prisma формирует SQL-запрос (это зона Repository/integration-тестов).
jest.mock('@/repositories/task.repository');

const mockedRepository = taskRepository as jest.Mocked<typeof taskRepository>;

const buildFakeTask = (overrides: Partial<Task> = {}): Task => ({
    id: 'task-1',
    title: 'Sample task',
    description: null,
    done: false,
    priority: 5,
    category: null,
    dueDate: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    ...overrides,
});

describe('TaskService', () => {
    describe('getTaskById', () => {
        it('returns the task when it exists', async () => {
            const fakeTask = buildFakeTask();
            mockedRepository.findById.mockResolvedValue(fakeTask);

            const result = await taskService.getTaskById('task-1');

            expect(result).toEqual(fakeTask);
            expect(mockedRepository.findById).toHaveBeenCalledWith('task-1');
        });

        it('throws NotFoundError when the task does not exist', async () => {
            mockedRepository.findById.mockResolvedValue(null);

            await expect(taskService.getTaskById('missing-id')).rejects.toThrow(NotFoundError);
        });
    });

    describe('updateTask', () => {
        it('throws NotFoundError when updating a non-existent task', async () => {
            mockedRepository.exists.mockResolvedValue(false);

            await expect(
                taskService.updateTask('missing-id', { title: 'New title' }),
            ).rejects.toThrow(NotFoundError);

            // update не должен вызываться, если сущность не найдена —
            // защита от лишнего запроса к БД
            expect(mockedRepository.update).not.toHaveBeenCalled();
        });

        it('updates the task when it exists', async () => {
            mockedRepository.exists.mockResolvedValue(true);
            const updatedTask = buildFakeTask({ title: 'Updated title' });
            mockedRepository.update.mockResolvedValue(updatedTask);

            const result = await taskService.updateTask('task-1', { title: 'Updated title' });

            expect(result.title).toBe('Updated title');
        });
    });

    describe('toggleDone', () => {
        it('flips done from false to true', async () => {
            const fakeTask = buildFakeTask({ done: false });
            mockedRepository.findById.mockResolvedValue(fakeTask);
            mockedRepository.update.mockResolvedValue(buildFakeTask({ done: true }));

            const result = await taskService.toggleDone('task-1');

            expect(mockedRepository.update).toHaveBeenCalledWith('task-1', { done: true });
            expect(result.done).toBe(true);
        });

        it('flips done from true to false', async () => {
            const fakeTask = buildFakeTask({ done: true });
            mockedRepository.findById.mockResolvedValue(fakeTask);
            mockedRepository.update.mockResolvedValue(buildFakeTask({ done: false }));

            await taskService.toggleDone('task-1');

            expect(mockedRepository.update).toHaveBeenCalledWith('task-1', { done: false });
        });
    });

    describe('deleteTask', () => {
        it('throws NotFoundError when deleting a non-existent task', async () => {
            mockedRepository.exists.mockResolvedValue(false);

            await expect(taskService.deleteTask('missing-id')).rejects.toThrow(NotFoundError);
            expect(mockedRepository.delete).not.toHaveBeenCalled();
        });
    });
});