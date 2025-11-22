import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import linksRoutes from './routes/links.routes.js';
import redirectRoutes from './routes/redirect.routes.js';
import healthRoutes from './routes/health.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/links', linksRoutes);
app.use('/healthz', healthRoutes);

// Redirect route (must be last to catch /:code)
app.use('/', redirectRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

export default app;
