import { prisma } from '@/config/prisma';

// Очищаем таблицу перед каждым тестом — гарантирует независимость тестов друг от друга.
// Не используем transaction rollback (популярный паттерн), т.к. с driver adapters
// это усложняет setup непропорционально выгоде для scope этого проекта.
beforeEach(async () => {
    await prisma.task.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});