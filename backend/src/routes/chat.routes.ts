import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJwt);

router.post('/messages', (req, res, next) => chatController.sendMessage(req, res, next));
router.get('/messages/:swapId', (req, res, next) => chatController.getSwapMessages(req, res, next));
router.get('/unread-count', (req, res, next) => chatController.getUnreadCount(req, res, next));

export default router;
