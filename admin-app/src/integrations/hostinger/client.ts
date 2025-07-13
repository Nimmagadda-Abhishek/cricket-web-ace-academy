// Hostinger MySQL client configuration
// We're creating a browser-safe version that doesn't try to import mysql2

// Get environment variables with bulletproof fallback
function getEnvOrDummy(env: string | undefined, dummy: string) {
  return (env && env.trim().length > 0) ? env : dummy;
}

// Log configuration info without actually connecting
const dbHost = getEnvOrDummy(import.meta.env.VITE_DB_HOST, "localhost");
console.log(`Hostinger DB would connect to host: ${dbHost.substring(0, 10)}... (browser-safe mode)`);

// Create a mock pool for browser environments
const isBrowser = typeof window !== 'undefined';
let pool: any;

// In browser environments, we'll use a mock implementation
if (isBrowser) {
  console.log('Running in browser environment, using mock database client');
  pool = {
    // Mock implementation that returns empty results
    query: async () => [[]],
    execute: async () => [[]],
    getConnection: async () => ({
      query: async () => [[]],
      execute: async () => [[]],
      release: () => {},
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {}
    })
  };
} else {
  // This code will never run in the browser
  console.log('Running in Node.js environment, using real database client');
  try {
    // This import will only happen in Node.js environments
    const mysql = require('mysql2/promise');
    
    // Database configuration
    const dbConfig = {
      host: dbHost,
      user: getEnvOrDummy(import.meta.env.VITE_DB_USER, "root"),
      password: getEnvOrDummy(import.meta.env.VITE_DB_PASSWORD, ""),
      database: getEnvOrDummy(import.meta.env.VITE_DB_NAME, "cricket_academy"),
      port: parseInt(getEnvOrDummy(import.meta.env.VITE_DB_PORT, "3306")),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
    
    pool = mysql.createPool(dbConfig);
    console.log('MySQL connection pool created successfully');
  } catch (error) {
    console.error('Failed to create MySQL connection pool:', error);
    pool = {
      query: async () => [[]],
      execute: async () => [[]]
    };
  }
}

// Export a function to check connection
export async function checkHostingerConnection() {
  if (typeof window !== 'undefined') {
    console.log('Running in browser environment, database connection check will return mock response');
    return { 
      connected: false, 
      message: 'Database connections are not supported in browser environments. Using mock data instead.' 
    };
  }
  
  try {
    const connection = await pool.getConnection();
    connection.release();
    return { connected: true, message: 'Connected to Hostinger database' };
  } catch (error) {
    console.error('Hostinger database connection error:', error);
    return { 
      connected: false, 
      message: error instanceof Error ? error.message : 'Unknown error connecting to Hostinger database' 
    };
  }
}

// Mock data for browser environments
const mockPrograms = [
  {
    id: '1',
    title: 'Group Training',
    description: 'Group cricket training program',
    age_group: 'All ages',
    price: 8000,
    features: JSON.stringify(['Skill Drills', 'Team building activities']),
    prerequisites: JSON.stringify(['Basic physical fitness']),
  },
  {
    id: '2',
    title: 'Personalized Training',
    description: 'One-on-one cricket coaching',
    age_group: '12+ years',
    price: 15000,
    features: JSON.stringify(['Video Analysis', 'Customized training plans']),
    prerequisites: JSON.stringify(['Some playing experience preferred']),
  }
];

// Export the database client with mock implementation for browser
export const db = {
  // Execute a query with parameters
  query: async <T>(sql: string, params?: any[]): Promise<T[]> => {
    console.log('Mock DB query:', sql, params);
    
    if (typeof window !== 'undefined') {
      // In browser, return mock data based on the query
      if (sql.includes('programs')) {
        return mockPrograms as unknown as T[];
      }
      return [] as T[];
    }
    
    try {
      const [rows] = await pool.query(sql, params);
      return rows as T[];
    } catch (error) {
      console.error('Database query error:', error);
      // Return empty array instead of throwing
      return [] as T[];
    }
  },
  
  // Execute a single row query
  queryOne: async <T>(sql: string, params?: any[]): Promise<T | null> => {
    console.log('Mock DB queryOne:', sql, params);
    
    if (typeof window !== 'undefined') {
      // In browser, return mock data based on the query
      if (sql.includes('programs')) {
        const id = params?.[0];
        const program = mockPrograms.find(p => p.id === id) || mockPrograms[0];
        return program as unknown as T;
      }
      return null;
    }
    
    try {
      const [rows] = await pool.query(sql, params);
      const rowsArray = rows as T[];
      return rowsArray.length > 0 ? rowsArray[0] : null;
    } catch (error) {
      console.error('Database query error:', error);
      return null;
    }
  },
  
  // Execute an insert query and return the inserted ID
  insert: async (table: string, data: Record<string, any>): Promise<number> => {
    console.log('Mock DB insert:', table, data);
    
    if (typeof window !== 'undefined') {
      // In browser, return a mock ID
      return Math.floor(Math.random() * 1000) + 100;
    }
    
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);
      
      const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
      const [result] = await pool.query(sql, values);
      return (result as any).insertId;
    } catch (error) {
      console.error('Database insert error:', error);
      return 0;
    }
  },
  
  // Execute an update query
  update: async (table: string, data: Record<string, any>, whereClause: string, whereParams?: any[]): Promise<number> => {
    console.log('Mock DB update:', table, data, whereClause, whereParams);
    
    if (typeof window !== 'undefined') {
      // In browser, return a mock affected rows count
      return 1;
    }
    
    try {
      const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
      const values = [...Object.values(data), ...(whereParams || [])];
      
      const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
      const [result] = await pool.query(sql, values);
      return (result as any).affectedRows;
    } catch (error) {
      console.error('Database update error:', error);
      return 0;
    }
  },
  
  // Execute a delete query
  delete: async (table: string, whereClause: string, whereParams?: any[]): Promise<number> => {
    console.log('Mock DB delete:', table, whereClause, whereParams);
    
    if (typeof window !== 'undefined') {
      // In browser, return a mock affected rows count
      return 1;
    }
    
    try {
      const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
      const [result] = await pool.query(sql, whereParams);
      return (result as any).affectedRows;
    } catch (error) {
      console.error('Database delete error:', error);
      return 0;
    }
  },
  
  // Begin a transaction
  beginTransaction: async () => {
    if (typeof window !== 'undefined') {
      console.log('Mock DB beginTransaction');
      return {
        query: async () => [[]],
        execute: async () => [[]],
        release: () => {},
        commit: async () => {},
        rollback: async () => {}
      };
    }
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    return connection;
  },
  
  // Commit a transaction
  commit: async (connection: any) => {
    if (typeof window !== 'undefined') {
      console.log('Mock DB commit');
      return;
    }
    
    await connection.commit();
    connection.release();
  },
  
  // Rollback a transaction
  rollback: async (connection: any) => {
    if (typeof window !== 'undefined') {
      console.log('Mock DB rollback');
      return;
    }
    
    await connection.rollback();
    connection.release();
  }
};

export default db;