import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

router.use(authenticateJwt, authorizeRoles('ADMIN', 'MODERATOR'));

router.get('/stats', (req, res, next) => adminController.getDashboardStats(req, res, next));
router.get('/users', (req, res, next) => adminController.getAllUsers(req, res, next));
router.get('/items', (req, res, next) => adminController.getAllItems(req, res, next));
router.patch('/users/:userId/role', authorizeRoles('ADMIN'), (req, res, next) =>
  adminController.updateUserRole(req, res, next)
);
router.patch('/items/:itemId/status', (req, res, next) => adminController.updateItemStatus(req, res, next));


export default router;
