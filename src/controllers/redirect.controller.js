import LinksService from '../services/links.service.js';

const RedirectController = {
  async redirect(req, res, next) {
    try {
      const { code } = req.params;

      // Get link
      const link = await LinksService.getLinkByCode(code);

      // Increment click count
      await LinksService.incrementClicks(code);

      // Redirect with 302 status
      res.redirect(302, link.target_url);
    } catch (error) {
      if (error.status === 404) {
        return res.status(404).json({ error: 'Link not found' });
      }
      next(error);
    }
  }
};

export default RedirectController;
