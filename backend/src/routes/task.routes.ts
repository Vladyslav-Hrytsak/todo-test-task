import { Router } from 'express';
import { taskController } from '@/controllers/task.controller';
import { asyncHandler } from '@/middlewares/asyncHandler';

const router = Router();

router.get('/', asyncHandler(taskController.getAll.bind(taskController)));
router.get('/:id', asyncHandler(taskController.getById.bind(taskController)));
router.post('/', asyncHandler(taskController.create.bind(taskController)));
router.patch('/:id', asyncHandler(taskController.update.bind(taskController)));
router.patch('/:id/toggle', asyncHandler(taskController.toggleDone.bind(taskController)));
router.delete('/:id', asyncHandler(taskController.delete.bind(taskController)));

export default router;