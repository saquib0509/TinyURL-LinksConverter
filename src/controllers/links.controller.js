import LinksService from '../services/links.service.js';

const LinksController = {
  // POST /api/links - Create new link
  async createLink(req, res, next) {
    try {
      const { targetUrl, code } = req.body;

      if (!targetUrl) {
        return res.status(400).json({ error: 'targetUrl is required' });
      }

      const link = await LinksService.createLink(targetUrl, code);
      
      res.status(201).json({
        code: link.code,
        targetUrl: link.target_url,
        clicks: link.clicks,
        createdAt: link.created_at
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/links - Get all links
  async getAllLinks(req, res, next) {
    try {
      const links = await LinksService.getAllLinks();
      
      const formattedLinks = links.map(link => ({
        code: link.code,
        targetUrl: link.target_url,
        clicks: link.clicks,
        lastClickedAt: link.last_clicked_at,
        createdAt: link.created_at
      }));

      res.json(formattedLinks);
    } catch (error) {
      next(error);
    }
  },

  // GET /api/links/:code - Get link stats
  async getLinkStats(req, res, next) {
    try {
      const { code } = req.params;
      const link = await LinksService.getLinkByCode(code);

      res.json({
        code: link.code,
        targetUrl: link.target_url,
        clicks: link.clicks,
        lastClickedAt: link.last_clicked_at,
        createdAt: link.created_at
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/links/:code - Delete link
  async deleteLink(req, res, next) {
    try {
      const { code } = req.params;
      await LinksService.deleteLink(code);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

export default LinksController;
