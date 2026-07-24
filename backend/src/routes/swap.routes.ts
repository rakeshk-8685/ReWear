import { Router } from 'express';
import { swapController } from '../controllers/swap.controller';
import { authenticateJwt } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJwt);

router.post('/', (req, res, next) => swapController.createSwapProposal(req, res, next));
router.get('/my-swaps', (req, res, next) => swapController.getUserSwaps(req, res, next));
router.get('/:id', (req, res, next) => swapController.getSwapById(req, res, next));
router.patch('/:id/status', (req, res, next) => swapController.updateSwapStatus(req, res, next));
router.patch('/:id/shipping', (req, res, next) => swapController.updateShippingInfo(req, res, next));
router.post('/:id/dispute', (req, res, next) => swapController.fileDispute(req, res, next));

export default router;
