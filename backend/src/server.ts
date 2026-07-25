import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { initSocketServer } from './socket/socket.server';
import { seedDatabaseIfEmpty } from './utils/seed';

const startServer = async () => {
  try {
    // Create HTTP Server & Socket.io Engine
    const server = http.createServer(app);
    initSocketServer(server);

    // Start Listening immediately so Render health checks & CORS preflights succeed
    server.listen(env.PORT, () => {
      console.log(`=================================================`);
      console.log(`  🚀 ReWear Enterprise Backend Engine Started  `);
      console.log(`  🌐 Environment : ${env.NODE_ENV}`);
      console.log(`  📡 HTTP API    : http://localhost:${env.PORT}/api`);
      console.log(`  📚 Swagger UI  : http://localhost:${env.PORT}/api-docs`);
      console.log(`  ⚡ Socket.io   : http://localhost:${env.PORT}`);
      console.log(`=================================================`);
    });

    // Connect to MongoDB asynchronously
    try {
      await connectDB();
      await seedDatabaseIfEmpty();
    } catch (dbErr) {
      console.error('[MongoDB] Warning: Initial database connection failed:', dbErr);
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
