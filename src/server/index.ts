import { Server } from 'najm-api';
import { db } from '@/server/database/db';
import translations from '../locales';
import './modules';

const app = await Server({
  serverless: true,
  basePath: '/api',
  cors: true,
  db,
  i18n: {
    translations,
    defaultLanguage: 'fr'
  }
});

export default app;
