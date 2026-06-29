import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Ensure the connection string is provided
const sql = neon(process.env.DATABASE_URL || "postgresql://mock_user:mock_pass@ep-mock-host.neon.tech/neondb?sslmode=require");
export const db = drizzle(sql);
