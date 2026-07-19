import { prisma } from '@/config/prisma';

beforeEach(async () => {
    await prisma.task.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});