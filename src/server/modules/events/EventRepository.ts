import { Repository, Injectable } from 'najm-api';
import { and, eq, gte, lte, or, desc, asc, sql, count, isNull } from 'drizzle-orm';
import { events, eventParticipants, users, classes, sections } from '../../database/schema';
import { eventSelect, userSelect, classSelect, sectionSelect } from '../../shared/selectDefinitions';

@Repository()
@Injectable()
export class EventRepository {

  private buildEventQuery() {
    return this.db.select({
      ...eventSelect,
      organizer: userSelect,
      class: classSelect,
      section: sectionSelect,
    }).from(events)
      .leftJoin(users, eq(events.organizerId, users.id))
      .leftJoin(classes, eq(events.classId, classes.id))
      .leftJoin(sections, eq(events.sectionId, sections.id));
  }

  async getAll(filter?: any[]) {
    let query = this.buildEventQuery();

    if (filter && filter.length > 0) {
      query = query.where(and(...filter));
    }

    return await query.orderBy(desc(events.startDate));
  }

  async getById(id: string) {
    const [event] = await this.buildEventQuery()
      .where(eq(events.id, id));
    return event;
  }

  async getByStatus(status: string) {
    return await this.buildEventQuery()
      .where(eq(events.status, status as any))
      .orderBy(asc(events.startDate));
  }

  async getByType(type: string) {
    return await this.buildEventQuery()
      .where(eq(events.type, type as any))
      .orderBy(desc(events.startDate));
  }

  async getByOrganizer(organizerId: string) {
    return await this.buildEventQuery()
      .where(eq(events.organizerId, organizerId))
      .orderBy(desc(events.startDate));
  }

  async getByClass(classId: string) {
    return await this.buildEventQuery()
      .where(eq(events.classId, classId))
      .orderBy(desc(events.startDate));
  }

  async getBySection(sectionId: string) {
    return await this.buildEventQuery()
      .where(eq(events.sectionId, sectionId))
      .orderBy(desc(events.startDate));
  }

  async getByVisibility(visibility: string) {
    return await this.buildEventQuery()
      .where(eq(events.visibility, visibility as any))
      .orderBy(desc(events.startDate));
  }

  async getUpcoming() {
    const today = new Date().toISOString().split('T')[0];
    return await this.buildEventQuery()
      .where(and(
        gte(events.startDate, today),
        or(
          eq(events.status, 'scheduled'),
          eq(events.status, 'ongoing')
        )
      ))
      .orderBy(asc(events.startDate));
  }

  async getPast() {
    const today = new Date().toISOString().split('T')[0];
    return await this.buildEventQuery()
      .where(and(
        lte(events.endDate, today),
        or(
          eq(events.status, 'completed'),
          eq(events.status, 'cancelled')
        )
      ))
      .orderBy(desc(events.startDate));
  }

  async getByDateRange(startDate: string, endDate: string) {
    return await this.buildEventQuery()
      .where(and(
        gte(events.startDate, startDate),
        lte(events.endDate, endDate)
      ))
      .orderBy(asc(events.startDate));
  }

  async getActiveEvents() {
    const today = new Date().toISOString().split('T')[0];
    return await this.buildEventQuery()
      .where(and(
        lte(events.startDate, today),
        gte(events.endDate, today),
        eq(events.status, 'ongoing')
      ))
      .orderBy(asc(events.startDate));
  }

  async create(data: any) {
    const [newEvent] = await this.db.insert(events)
      .values(data)
      .returning();
    return this.getById(newEvent.id);
  }

  async update(id: string, data: any) {
    await this.db.update(events)
      .set(data)
      .where(eq(events.id, id));
    return this.getById(id);
  }

  async delete(id: string) {
    await this.db.delete(events)
      .where(eq(events.id, id));
    return { success: true };
  }

  async deleteAll() {
    await this.db.delete(events);
    return { success: true };
  }

  // ========== EVENT PARTICIPANTS ==========//

  async getParticipants(eventId: string) {
    return await this.db.select()
      .from(eventParticipants)
      .where(eq(eventParticipants.eventId, eventId))
      .orderBy(desc(eventParticipants.registrationDate));
  }

  async getParticipantsByType(eventId: string, participantType: string) {
    return await this.db.select()
      .from(eventParticipants)
      .where(and(
        eq(eventParticipants.eventId, eventId),
        eq(eventParticipants.participantType, participantType)
      ))
      .orderBy(desc(eventParticipants.registrationDate));
  }

  async getEventsByParticipant(participantId: string) {
    const results = await this.db.select({
      ...eventSelect,
      organizer: userSelect,
      class: classSelect,
      section: sectionSelect,
      participation: {
        id: eventParticipants.id,
        registrationDate: eventParticipants.registrationDate,
        attendanceStatus: eventParticipants.attendanceStatus,
        notes: eventParticipants.notes,
      },
    })
      .from(eventParticipants)
      .innerJoin(events, eq(eventParticipants.eventId, events.id))
      .leftJoin(users, eq(events.organizerId, users.id))
      .leftJoin(classes, eq(events.classId, classes.id))
      .leftJoin(sections, eq(events.sectionId, sections.id))
      .where(eq(eventParticipants.participantId, participantId))
      .orderBy(desc(events.startDate));

    return results;
  }

  async addParticipant(data: any) {
    const [participant] = await this.db.insert(eventParticipants)
      .values(data)
      .returning();
    return participant;
  }

  async addParticipantsBulk(participants: any[]) {
    return await this.db.insert(eventParticipants)
      .values(participants)
      .returning();
  }

  async updateParticipant(id: string, data: any) {
    const [updated] = await this.db.update(eventParticipants)
      .set(data)
      .where(eq(eventParticipants.id, id))
      .returning();
    return updated;
  }

  async removeParticipant(id: string) {
    await this.db.delete(eventParticipants)
      .where(eq(eventParticipants.id, id));
    return { success: true };
  }

  async checkParticipantExists(eventId: string, participantId: string) {
    const [exists] = await this.db.select({ id: eventParticipants.id })
      .from(eventParticipants)
      .where(and(
        eq(eventParticipants.eventId, eventId),
        eq(eventParticipants.participantId, participantId)
      ))
      .limit(1);
    return !!exists;
  }

  async getParticipantCount(eventId: string) {
    const [result] = await this.db.select({
      total: count(),
    })
      .from(eventParticipants)
      .where(eq(eventParticipants.eventId, eventId));
    return result.total;
  }

  // ========== ANALYTICS ==========//

  async getEventAnalytics() {
    const [analytics] = await this.db.select({
      totalEvents: count(),
      upcoming: count(sql`CASE WHEN ${events.status} = 'scheduled' THEN 1 END`),
      ongoing: count(sql`CASE WHEN ${events.status} = 'ongoing' THEN 1 END`),
      completed: count(sql`CASE WHEN ${events.status} = 'completed' THEN 1 END`),
      cancelled: count(sql`CASE WHEN ${events.status} = 'cancelled' THEN 1 END`),
    })
      .from(events);

    return analytics;
  }

  async getEventsByTypeCount() {
    return await this.db.select({
      type: events.type,
      count: count(),
    })
      .from(events)
      .groupBy(events.type)
      .orderBy(desc(count()));
  }
}
