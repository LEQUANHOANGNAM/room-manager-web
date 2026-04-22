import express from 'express';
import chatController from '../controllers/chat.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', requireAuth, chatController);

export default router;