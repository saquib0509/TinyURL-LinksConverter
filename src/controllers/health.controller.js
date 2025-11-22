import { pool } from '../config/db.js';

const HealthController = {
  async check(req, res, next) {
    try {
      // Test database connection
      await pool.query('SELECT 1');

      const uptime = process.uptime();
      const uptimeFormatted = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;

      res.status(200).json({
        ok: true,
        version: process.env.APP_VERSION || '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: uptimeFormatted,
        database: 'connected',
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      res.status(503).json({
        ok: false,
        version: process.env.APP_VERSION || '1.0.0',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message
      });
    }
  }
};

export default HealthController;
