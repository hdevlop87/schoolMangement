import type { DB } from '@/server/database/db';

declare global {
  // Make 'this.db' available in all classes
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  var db: DB;
}

// Augment all class prototypes
interface Object {
  db?: DB;
}

export {};