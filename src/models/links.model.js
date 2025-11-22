import { pool } from '../config/db.js';

const LinksModel = {
  // Create a new link
  async create(code, targetUrl) {
    const query = `
      INSERT INTO links (code, target_url)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [code, targetUrl]);
    return result.rows[0];
  },

  // Get all links
  async findAll() {
    const query = `
      SELECT code, target_url, clicks, last_clicked_at, created_at
      FROM links
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  // Get a link by code
  async findByCode(code) {
    const query = `
      SELECT *
      FROM links
      WHERE code = $1
    `;
    const result = await pool.query(query, [code]);
    return result.rows[0];
  },

  // Update click count and last clicked timestamp
  async incrementClicks(code) {
    const query = `
      UPDATE links
      SET clicks = clicks + 1,
          last_clicked_at = CURRENT_TIMESTAMP
      WHERE code = $1
      RETURNING *
    `;
    const result = await pool.query(query, [code]);
    return result.rows[0];
  },

  // Delete a link
  async delete(code) {
    const query = `
      DELETE FROM links
      WHERE code = $1
      RETURNING *
    `;
    const result = await pool.query(query, [code]);
    return result.rows[0];
  },

  // Check if code exists
  async codeExists(code) {
    const query = `
      SELECT EXISTS(SELECT 1 FROM links WHERE code = $1) as exists
    `;
    const result = await pool.query(query, [code]);
    return result.rows[0].exists;
  }
};

export default LinksModel;
