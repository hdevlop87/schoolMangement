import { DB } from '@/server/database/db';
import { parents, users, students, studentParents } from '@/server/database/schema';
import { count, eq, desc, and, inArray } from 'drizzle-orm';
import { Repository } from 'najm-api';
import {
  parentSelect,
  studentSelect,

} from '@/server/shared/selectDefinitions';

@Repository()
export class ParentRepository {

  db: DB;

  // ========================================
  // QUERY_BUILDERS (Reusable)
  // ========================================


  private buildParentQuery() {
    return this.db
      .select(parentSelect)
      .from(parents)
      .leftJoin(users, eq(parents.userId, users.id));
  }

  private buildChildrenQuery() {
    return this.db
      .select({
        ...studentSelect,
        isEmergencyContact: parents.isEmergencyContact,
        financialResponsibility: parents.financialResponsibility,
        relationshipType: parents.relationshipType,
      })
      .from(studentParents)
      .innerJoin(students, eq(studentParents.studentId, students.id))
      .innerJoin(parents, eq(studentParents.parentId, parents.id))
      .leftJoin(users, eq(students.userId, users.id));
  }

  // ========================================
  // GET_READ_METHODS
  // ========================================

  async getCount() {
    const [parentsCount] = await this.db
      .select({ count: count() })
      .from(parents);
    return parentsCount;
  }

  async getAll(filter) {
    if (filter === 'ALL') {
      return await this.getAllParents();
    }
    return await this.getByIds(filter);
  }

  async getAllParents() {
    return await this.buildParentQuery()
      .orderBy(desc(parents.createdAt));
  }

  async getByIds(ids) {
    if (!ids || ids.length === 0) return [];

    return await this.buildParentQuery()
      .where(inArray(parents.id, ids))
      .orderBy(desc(parents.createdAt));
  }

  async getById(id) {
    const [existingParent] = await this.buildParentQuery()
      .where(eq(parents.id, id))
      .limit(1);

    return existingParent

  }

  async getByEmail(email) {
    const [existingParent] = await this.buildParentQuery()
      .where(eq(users.email, email))
      .limit(1);
    return existingParent;
  }

  async getByCin(cin) {
    const [existingParent] = await this.buildParentQuery()
      .where(eq(parents.cin, cin))
      .limit(1);
    return existingParent;
  }

  async getByPhone(phone) {
    const [existingParent] = await this.buildParentQuery()
      .where(eq(parents.phone, phone))
      .limit(1);
    return existingParent;
  }

  async getByRelationshipType(relationshipType) {
    return await this.buildParentQuery()
      .where(eq(parents.relationshipType, relationshipType))
      .orderBy(parents.name);
  }

  async getEmergencyContacts() {
    return await this.buildParentQuery()
      .where(eq(parents.isEmergencyContact, true))
      .orderBy(parents.name);
  }

  async getChildren(parentId) {
    return await this.buildChildrenQuery()
      .where(eq(studentParents.parentId, parentId))
      .orderBy(students.name);
  }

  async checkStudentExists(studentId) {
    const [student] = await this.db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    return !!student;
  }

  async checkStudentLinked(parentId, studentId) {
    const [link] = await this.db
      .select({ id: studentParents.id })
      .from(studentParents)
      .where(
        and(
          eq(studentParents.parentId, parentId),
          eq(studentParents.studentId, studentId)
        )
      )
      .limit(1);

    return !!link;
  }

  async checkLinkedToStudents(parentId) {
    const [link] = await this.db
      .select({ count: count() })
      .from(studentParents)
      .where(eq(studentParents.parentId, parentId))
      .limit(1);

    return link.count > 0;
  }

  async getChildrenCount(parentId) {
    const [childrenData] = await this.db
      .select({
        totalChildren: count(studentParents.studentId),
      })
      .from(studentParents)
      .where(eq(studentParents.parentId, parentId));

    return {
      totalChildren: Number(childrenData.totalChildren) || 0,
    };
  }

  // ========================================
  // CREATE_METHODS
  // ========================================

  async create(data) {
    const [newParent] = await this.db
      .insert(parents)
      .values(data)
      .returning();
    return newParent;
  }

  async linkStudent(linkData) {
    const [link] = await this.db
      .insert(studentParents)
      .values(linkData)
      .returning();
    return link;
  }

  // ========================================
  // UPDATE_METHODS
  // ========================================

  async update(id, data) {
    const [updatedParent] = await this.db
      .update(parents)
      .set(data)
      .where(eq(parents.id, id))
      .returning();
    return updatedParent;
  }

  // ========================================
  // DELETE_METHODS
  // ========================================

  async delete(id) {
    const [deletedParent] = await this.db
      .delete(parents)
      .where(eq(parents.id, id))
      .returning();

    if (deletedParent?.userId) {
      await this.db
        .delete(users)
        .where(eq(users.id, deletedParent.userId));
    }
    return deletedParent;
  }

  async unlinkStudent(parentId, studentId) {
    const [unlink] = await this.db
      .delete(studentParents)
      .where(
        and(
          eq(studentParents.parentId, parentId),
          eq(studentParents.studentId, studentId)
        )
      )
      .returning();
    return unlink;
  }

  async deleteAll() {
    const allParents = await this.buildParentQuery()
      .orderBy(desc(parents.createdAt));

    const userIds = allParents
      .map(parent => parent.userId)
      .filter(userId => userId !== null);

    const deletedParents = await this.db
      .delete(parents)
      .returning();

    let deletedUsers = [];
    if (userIds.length > 0) {
      deletedUsers = await this.db
        .delete(users)
        .where(inArray(users.id, userIds))
        .returning();
    }

    return {
      deletedCount: deletedParents.length,
      deletedParents: deletedParents,
    };
  }

}