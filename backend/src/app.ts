import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Health check — полезно для деплоя (Render проверяет этот эндпоинт)
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default app;