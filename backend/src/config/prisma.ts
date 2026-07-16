import {PrismaClient} from "@prisma/client/extension";

// Singleton pattern: избегаем создания множества соединений с БД
// при hot-reload в dev-режиме (ts-node-dev пересоздаёт модули)

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}