import { Router } from 'express';
import { reportController } from '../controllers/report.controller';

const router = Router();

router.get('/impact', (req, res, next) => reportController.getImpactReport(req, res, next));

export default router;
