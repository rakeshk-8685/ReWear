import mongoose from 'mongoose';
import { env } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    let uri = env.MONGO_URI;

    // Handle unencoded @ symbols in database password
    const srvPrefix = 'mongodb+srv://';
    if (uri.startsWith(srvPrefix)) {
      const rest = uri.slice(srvPrefix.length);
      const lastAtIndex = rest.lastIndexOf('@');
      if (lastAtIndex > -1) {
        const userInfo = rest.slice(0, lastAtIndex);
        const hostInfo = rest.slice(lastAtIndex + 1);
        const colonIndex = userInfo.indexOf(':');
        if (colonIndex > -1) {
          const user = userInfo.slice(0, colonIndex);
          const pass = userInfo.slice(colonIndex + 1);
          const encodedPass = encodeURIComponent(decodeURIComponent(pass));
          uri = `${srvPrefix}${user}:${encodedPass}@${hostInfo}`;
        }
      }
    }

    const conn = await mongoose.connect(uri, {
      dbName: 'rewear',
    });
    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Error connecting to database:`, error);
    process.exit(1);
  }
};
