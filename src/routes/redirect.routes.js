import express from 'express';
import RedirectController from '../controllers/redirect.controller.js';

const router = express.Router();

// GET /:code - Redirect to target URL
router.get('/:code', RedirectController.redirect);

export default router;
