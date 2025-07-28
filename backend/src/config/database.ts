import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'] as const;
type EnvVar = typeof requiredEnvVars[number];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Optional SSL configuration depending on environment variable
const sslConfig = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

// Create MySQL connection pool for Hostinger database
const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(sslConfig ? { ssl: sslConfig } : {}),
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000, // 10 seconds
  timezone: '+00:00',
});

// Database health check with detailed error reporting
export const checkDatabaseHealth = async (): Promise<{ healthy: boolean; message: string }> => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return { healthy: true, message: 'Database connection successful' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Database health check failed:', errorMessage);
    return { 
      healthy: false, 
      message: `Database connection failed: ${errorMessage}`
    };
  }
};

// Get database statistics with error handling
export const getDatabaseStats = async (): Promise<{ success: boolean; data?: any; error?: string }> => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query('SHOW TABLE STATUS');
    return {
      success: true,
      data: rows
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error getting database stats:', errorMessage);
    return {
      success: false,
      error: errorMessage
    };
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Removed unsupported pool.on('error') event listener

export default pool;
