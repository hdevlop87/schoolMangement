import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
  import * as schema from './schema';
  
  export type DB = PostgresJsDatabase<typeof schema>;
  export const db: DB = drizzle(process.env.DB_URL);