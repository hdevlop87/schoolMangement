import type { Config } from 'drizzle-kit';
  
  export default {
     schema: './src/server/database/schema/*.ts',
     out: './src/server/database/migrations',
     dialect: 'postgresql',
     dbCredentials: {
        url: process.env.DB_URL!,
     },
  } satisfies Config;