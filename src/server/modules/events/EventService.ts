import { Injectable, t } from 'najm-api';
import { EventRepository } from './EventRepository';
import { EventValidator } from './EventValidator';

@Injectable()
export class EventService {

  constructor(
    private eventRepository: EventRepository,
    private eventValidator: EventValidator,
  ) { }

  // ========== EVENT OPERATIONS ==========//

  async getAll(filter?: any[]) {
    return await this.eventRepository.getAll(filter);
  }

  async getById(id: string) {
    return await this.eventValidator.checkExists(id);
  }

  async getByStatus(status: string) {
    return await this.eventRepository.getByStatus(status);
  }

  async getByType(type: string) {
    return await this.eventRepository.getByType(type);
  }

  async getByOrganizer(organizerId: string) {
    return await this.eventRepository.getByOrganizer(organizerId);
  }

  async getByClass(classId: string) {
    return await this.eventRepository.getByClass(classId);
  }

  async getBySection(sectionId: string) {
    return await this.eventRepository.getBySection(sectionId);
  }

  async getByVisibility(visibility: string) {
    return await this.eventRepository.getByVisibility(visibility);
  }

  async getUpcoming() {
    return await this.eventRepository.getUpcoming();
  }

  async getPast() {
    return await this.eventRepository.getPast();
  }

  async getByDateRange(startDate: string, endDate: string) {
    await this.eventValidator.validateEventDates(startDate, endDate);
    return await this.eventRepository.getByDateRange(startDate, endDate);
  }

  async getActiveEvents() {
    return await this.eventRepository.getActiveEvents();
  }

  async create(data: any) {
    // Validate input
    const validated = await this.eventValidator.validate(data);

    // Validate class and section if provided
    await this.eventValidator.validateClassAndSection(validated.classId, validated.sectionId);

    // Validate dates
    await this.eventValidator.validateEventDates(validated.startDate, validated.endDate);

    // Calculate dueAmount
    const eventData = {
      ...validated,
      status: validated.status || 'scheduled',
    };

    return await this.eventRepository.create(eventData);
  }

  async update(id: string, data: any) {
    await this.eventValidator.checkExists(id);

    // Validate input
    const validated = await this.eventValidator.validate(data);

    // Validate class and section if provided
    if (validated.classId || validated.sectionId) {
      await this.eventValidator.validateClassAndSection(validated.classId, validated.sectionId);
    }

    // Validate dates if changed
    if (validated.startDate && validated.endDate) {
      await this.eventValidator.validateEventDates(validated.startDate, validated.endDate);
    }

    return await this.eventRepository.update(id, validated);
  }

  async delete(id: string) {
    await this.eventValidator.checkExists(id);
    return await this.eventRepository.delete(id);
  }

  async deleteAll() {
    return await this.eventRepository.deleteAll();
  }

  // ========== EVENT STATUS MANAGEMENT ==========//

  async startEvent(id: string) {
    await this.eventValidator.validateEventStatus(id, ['scheduled']);

    return await this.eventRepository.update(id, {
      status: 'ongoing',
    });
  }

  async completeEvent(id: string) {
    await this.eventValidator.validateEventStatus(id, ['ongoing', 'scheduled']);

    return await this.eventRepository.update(id, {
      status: 'completed',
    });
  }

  async cancelEvent(id: string) {
    await this.eventValidator.validateEventStatus(id, ['scheduled', 'ongoing']);

    return await this.eventRepository.update(id, {
      status: 'cancelled',
    });
  }

  async postponeEvent(id: string, newStartDate: string, newEndDate: string) {
    await this.eventValidator.checkExists(id);
    await this.eventValidator.validateEventDates(newStartDate, newEndDate);

    return await this.eventRepository.update(id, {
      startDate: newStartDate,
      endDate: newEndDate,
      status: 'postponed',
    });
  }

  // ========== PARTICIPANT OPERATIONS ==========//

  async getParticipants(eventId: string) {
    await this.eventValidator.checkExists(eventId);
    return await this.eventRepository.getParticipants(eventId);
  }

  async getParticipantsByType(eventId: string, participantType: string) {
    await this.eventValidator.checkExists(eventId);
    return await this.eventRepository.getParticipantsByType(eventId, participantType);
  }

  async getEventsByParticipant(participantId: string) {
    return await this.eventRepository.getEventsByParticipant(participantId);
  }

  async addParticipant(data: any) {
    // Validate input
    const validated = await this.eventValidator.validateParticipant(data);

    // Validate event exists and registration is allowed
    await this.eventValidator.validateParticipantRegistration(
      validated.eventId,
      validated.participantId
    );

    return await this.eventRepository.addParticipant(validated);
  }

  async updateParticipant(id: string, data: any) {
    return await this.eventRepository.updateParticipant(id, data);
  }

  async removeParticipant(id: string) {
    return await this.eventRepository.removeParticipant(id);
  }

  async markAttendance(id: string, status: string) {
    return await this.eventRepository.updateParticipant(id, {
      attendanceStatus: status,
    });
  }

  // ========== ANALYTICS ==========//

  async getEventAnalytics() {
    return await this.eventRepository.getEventAnalytics();
  }

  async getEventsByTypeCount() {
    return await this.eventRepository.getEventsByTypeCount();
  }

  async getParticipantCount(eventId: string) {
    await this.eventValidator.checkExists(eventId);
    return await this.eventRepository.getParticipantCount(eventId);
  }
}
