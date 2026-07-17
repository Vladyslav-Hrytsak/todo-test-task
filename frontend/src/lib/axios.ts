import axios from 'axios';

// Единая точка конфигурации HTTP-клиента: baseURL, таймауты, interceptors.
// Все API-функции в features/tasks/api импортируют именно этот инстанс,
// а не создают axios.create() заново — избегаем дублирования конфигурации.
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Централизованное логирование ошибок — точка расширения для Sentry и т.п.
        const message = error.response?.data?.error ?? 'Unexpected error occurred';
        console.error('[API Error]', message);
        return Promise.reject(error);
    },
);