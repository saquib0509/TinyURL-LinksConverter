import app from './app.js';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server after database is initialized
const startServer = async () => {
  try {
    // Initialize database first
    await initDB();
    
    // Then start the server
    app.listen(PORT, () => {
      console.log('TinyLink server running on port', PORT);
      console.log('Environment:', process.env.NODE_ENV || 'development');
      console.log('API ready at http://localhost:' + PORT);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
