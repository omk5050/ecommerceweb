import mongoose from 'mongoose';
import dns from 'dns';

// Configure DNS to resolve SRV records reliably across all network environments (e.g. Windows/ISPs)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch (dnsErr) {
  console.warn('[Database] DNS optimization warning:', dnsErr);
}

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('FATAL: MONGODB_URI environment variable is not defined.');
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`[MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB Atlas] Active database: ${conn.connection.name}`);
  } catch (error) {
    console.error('[MongoDB Atlas] Connection failed:', error instanceof Error ? error.message : error);
    throw error;
  }
};

export const getDBStatus = () => {
  const state = mongoose.connection.readyState;
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    state: stateMap[state] || 'unknown',
    readyState: state,
    isConnected: state === 1,
    host: state === 1 ? mongoose.connection.host : null,
    database: state === 1 ? mongoose.connection.name : null,
  };
};

export default connectDB;
