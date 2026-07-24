import { Router } from 'express';
import { itemController } from '../controllers/item.controller';
import { authenticateJwt } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', (req, res, next) => itemController.getFilteredItems(req, res, next));
router.get('/:id', (req, res, next) => itemController.getItemById(req, res, next));
router.post(
  '/',
  authenticateJwt,
  upload.array('images', 5),
  (req, res, next) => itemController.createItem(req, res, next)
);
router.put('/:id', authenticateJwt, (req, res, next) => itemController.updateItem(req, res, next));
router.delete('/:id', authenticateJwt, (req, res, next) => itemController.deleteItem(req, res, next));
router.post('/:id/like', authenticateJwt, (req, res, next) => itemController.toggleLike(req, res, next));

export default router;
