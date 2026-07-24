import http from 'http';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { initSocketServer } from './socket/socket.server';
import { seedDatabaseIfEmpty } from './utils/seed';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Auto-seed demo garments and users if database is currently empty
    await seedDatabaseIfEmpty();

    // Create HTTP Server
    const server = http.createServer(app);

    // Initialize Socket.io Real-Time Engine
    initSocketServer(server);

    // Start Listening
    server.listen(env.PORT, () => {
      console.log(`=================================================`);
      console.log(`  🚀 ReWear Enterprise Backend Engine Started  `);
      console.log(`  🌐 Environment : ${env.NODE_ENV}`);
      console.log(`  📡 HTTP API    : http://localhost:${env.PORT}/api`);
      console.log(`  ⚡ Socket.io   : http://localhost:${env.PORT}`);
      console.log(`=================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
