import LinksModel from '../models/links.model.js';
import { validateUrl, validateCode } from '../utils/validators.js';
import { generateCode } from '../utils/generateCode.js';

const LinksService = {
  async createLink(targetUrl, customCode = null) {
    // Validate URL
    if (!validateUrl(targetUrl)) {
      throw { status: 400, message: 'Invalid URL format' };
    }

    let code = customCode;

    // If custom code provided, validate it
    if (customCode) {
      if (!validateCode(customCode)) {
        throw { status: 400, message: 'Invalid code format. Use 6-8 alphanumeric characters.' };
      }

      // Check if code already exists
      const exists = await LinksModel.codeExists(customCode);
      if (exists) {
        throw { status: 409, message: 'Code already exists. Please choose a different code.' };
      }
    } else {
      // Generate unique code
      code = await this.generateUniqueCode();
    }

    // Create link
    const link = await LinksModel.create(code, targetUrl);
    return link;
  },

  async getAllLinks() {
    return await LinksModel.findAll();
  },

  async getLinkByCode(code) {
    const link = await LinksModel.findByCode(code);
    if (!link) {
      throw { status: 404, message: 'Link not found' };
    }
    return link;
  },

  async deleteLink(code) {
    const deleted = await LinksModel.delete(code);
    if (!deleted) {
      throw { status: 404, message: 'Link not found' };
    }
    return deleted;
  },

  async incrementClicks(code) {
    return await LinksModel.incrementClicks(code);
  },

  async generateUniqueCode() {
    let code;
    let exists = true;
    let attempts = 0;
    const maxAttempts = 10;

    while (exists && attempts < maxAttempts) {
      code = generateCode();
      exists = await LinksModel.codeExists(code);
      attempts++;
    }

    if (exists) {
      throw { status: 500, message: 'Unable to generate unique code. Please try again.' };
    }

    return code;
  }
};

export default LinksService;
