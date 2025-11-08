import { Injectable } from 'najm-api';
import { db } from '@/server/database/db';
import { files } from '@/server/database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class FileRepository {

  async getAll() {
    return await db.select().from(files);
  }

  async getById(id: string) {
    const result = await db.select().from(files).where(eq(files.id, id));
    return result[0] || null;
  }

  async getByEntityId(entityId: string) {
    return await db.select().from(files)
      .where(eq(files.entityId, entityId))
  }

  async getByFileName(fileName) {
    const result = await db.select().from(files).where(eq(files.name, fileName));
    return result[0] || null;
  }

  async getByFilePath(filePath: string) {
    const result = await db.select().from(files).where(eq(files.path, filePath));
    return result[0] || null;
  }

  async getByFileAbsPath(fileAbsPath: string) {
    const result = await db.select().from(files).where(eq(files.absPath, fileAbsPath));
    return result[0] || null;
  }

  async create(data: any) {
    const result = await db.insert(files).values(data).returning();
    return result[0];
  }

  async update(id: string, data: any) {
    const result = await db.update(files)
      .set(data)
      .where(eq(files.id, id))
      .returning();
    return result[0];
  }

  async delete(fileName: string) {
    const result = await db.delete(files)
      .where(eq(files.name, fileName))
      .returning();
    return result[0];
  }

  async getPublicFiles() {
    return await db.select().from(files).where(eq(files.isPublic, true));
  }

  async getFilesByStatus(status: any) {
    return await db.select().from(files).where(eq(files.status, status));
  }
}