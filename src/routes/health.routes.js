import express from 'express';
import HealthController from '../controllers/health.controller.js';

const router = express.Router();

// GET /healthz - Health check
router.get('/', HealthController.check);

export default router;
