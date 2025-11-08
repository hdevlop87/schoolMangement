import { Repository } from 'najm-api';
import { eq, desc, and, count, sql, inArray, or, isNull } from 'drizzle-orm';
import { announcements, users, classes, sections } from '@/server/database/schema';
import { DB } from '@/server/database/db';
import { classSelect, sectionSelect } from '@/server/shared/selectDefinitions';
import { alias } from 'drizzle-orm/pg-core';

@Repository()
export class AnnouncementRepository {
  declare db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================

  private buildAnnouncementQuery() {
    const authorUsers = alias(users, 'author_users');

    return this.db
      .select({
        id: announcements.id,
        title: announcements.title,
        content: announcements.content,
        authorId: announcements.authorId,
        targetAudience: announcements.targetAudience,
        classId: announcements.classId,
        sectionId: announcements.sectionId,
        isPublished: announcements.isPublished,
        publishDate: announcements.publishDate,
        expiryDate: announcements.expiryDate,
        createdAt: announcements.createdAt,
        updatedAt: announcements.updatedAt,
        author: {
          id: authorUsers.id,
          email: authorUsers.email,
          image: authorUsers.image,
        },
        class: classSelect,
        section: sectionSelect,
      })
      .from(announcements)
      .leftJoin(authorUsers, eq(announcements.authorId, authorUsers.id))
      .leftJoin(classes, eq(announcements.classId, classes.id))
      .leftJoin(sections, eq(announcements.sectionId, sections.id));
  }

  // ========================================
  // GET_READ_METHODS
  // ========================================

  async getCount() {
    const [announcementsCount] = await this.db
      .select({ count: count() })
      .from(announcements);
    return announcementsCount;
  }

  async getAll(filter) {
    if (filter === 'ALL') {
      return await this.getAllAnnouncements();
    }
    return await this.getByIds(filter);
  }

  async getAllAnnouncements() {
    return await this.buildAnnouncementQuery()
      .orderBy(desc(announcements.publishDate), desc(announcements.createdAt));
  }

  async getByIds(ids) {
    if (!ids || ids.length === 0) return [];

    return await this.buildAnnouncementQuery()
      .where(inArray(announcements.id, ids))
      .orderBy(desc(announcements.publishDate));
  }

  async getById(id: string) {
    const [announcement] = await this.buildAnnouncementQuery()
      .where(eq(announcements.id, id))
      .limit(1);

    return announcement;
  }

  async getByAuthor(authorId: string) {
    return await this.buildAnnouncementQuery()
      .where(eq(announcements.authorId, authorId))
      .orderBy(desc(announcements.createdAt));
  }

  async getByTargetAudience(targetAudience: string) {
    return await this.buildAnnouncementQuery()
      .where(eq(announcements.targetAudience, targetAudience))
      .orderBy(desc(announcements.publishDate));
  }

  async getByClass(classId: string) {
    return await this.buildAnnouncementQuery()
      .where(eq(announcements.classId, classId))
      .orderBy(desc(announcements.publishDate));
  }

  async getBySection(sectionId: string) {
    return await this.buildAnnouncementQuery()
      .where(eq(announcements.sectionId, sectionId))
      .orderBy(desc(announcements.publishDate));
  }

  async getPublished() {
    const now = new Date().toISOString();

    return await this.buildAnnouncementQuery()
      .where(
        and(
          eq(announcements.isPublished, true),
          or(
            isNull(announcements.publishDate),
            sql`${announcements.publishDate} <= ${now}`
          ),
          or(
            isNull(announcements.expiryDate),
            sql`${announcements.expiryDate} > ${now}`
          )
        )
      )
      .orderBy(desc(announcements.publishDate));
  }

  async getActiveForAudience(targetAudience: string, classId?: string, sectionId?: string) {
    const now = new Date().toISOString();

    let query = this.buildAnnouncementQuery()
      .where(
        and(
          eq(announcements.isPublished, true),
          or(
            eq(announcements.targetAudience, targetAudience),
            eq(announcements.targetAudience, 'all')
          ),
          or(
            isNull(announcements.publishDate),
            sql`${announcements.publishDate} <= ${now}`
          ),
          or(
            isNull(announcements.expiryDate),
            sql`${announcements.expiryDate} > ${now}`
          )
        )
      );

    // If classId or sectionId provided, also include announcements targeted to them
    if (classId) {
      query = query.where(
        or(
          isNull(announcements.classId),
          eq(announcements.classId, classId)
        )
      );
    }

    if (sectionId) {
      query = query.where(
        or(
          isNull(announcements.sectionId),
          eq(announcements.sectionId, sectionId)
        )
      );
    }

    return await query.orderBy(desc(announcements.publishDate));
  }

  async getUpcoming() {
    const now = new Date().toISOString();

    return await this.buildAnnouncementQuery()
      .where(
        and(
          eq(announcements.isPublished, false),
          sql`${announcements.publishDate} > ${now}`
        )
      )
      .orderBy(announcements.publishDate);
  }

  async getExpired() {
    const now = new Date().toISOString();

    return await this.buildAnnouncementQuery()
      .where(
        and(
          eq(announcements.isPublished, true),
          sql`${announcements.expiryDate} <= ${now}`
        )
      )
      .orderBy(desc(announcements.expiryDate));
  }

  // ========================================
  // CREATE_METHODS
  // ========================================

  async create(data) {
    const [newAnnouncement] = await this.db
      .insert(announcements)
      .values(data)
      .returning();
    return await this.getById(newAnnouncement.id);
  }

  // ========================================
  // UPDATE_METHODS
  // ========================================

  async update(id, data) {
    const [updatedAnnouncement] = await this.db
      .update(announcements)
      .set(data)
      .where(eq(announcements.id, id))
      .returning();
    return updatedAnnouncement;
  }

  async publish(id) {
    const [published] = await this.db
      .update(announcements)
      .set({
        isPublished: true,
        publishDate: new Date().toISOString()
      })
      .where(eq(announcements.id, id))
      .returning();
    return published;
  }

  async unpublish(id) {
    const [unpublished] = await this.db
      .update(announcements)
      .set({ isPublished: false })
      .where(eq(announcements.id, id))
      .returning();
    return unpublished;
  }

  // ========================================
  // DELETE_METHODS
  // ========================================

  async delete(id) {
    const [deletedAnnouncement] = await this.db
      .delete(announcements)
      .where(eq(announcements.id, id))
      .returning();
    return deletedAnnouncement;
  }

  async deleteAll() {
    const deletedAnnouncements = await this.db
      .delete(announcements)
      .returning();

    return {
      deletedCount: deletedAnnouncements.length,
      deletedAnnouncements: deletedAnnouncements
    };
  }
}
