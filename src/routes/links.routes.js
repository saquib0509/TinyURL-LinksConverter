import express from 'express';
import LinksController from '../controllers/links.controller.js';

const router = express.Router();

// POST /api/links - Create new link
router.post('/', LinksController.createLink);

// GET /api/links - Get all links
router.get('/', LinksController.getAllLinks);

// GET /api/links/:code - Get link stats
router.get('/:code', LinksController.getLinkStats);

// DELETE /api/links/:code - Delete link
router.delete('/:code', LinksController.deleteLink);

export default router;
