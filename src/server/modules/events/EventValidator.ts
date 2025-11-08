import { Injectable, t } from 'najm-api';
import { eventSchema, eventParticipantSchema } from '../../../lib/validations';
import { EventRepository } from './EventRepository';
import { ClassValidator } from '../classes/ClassValidator';
import { SectionValidator } from '../sections/SectionValidator';

@Injectable()
export class EventValidator {

  constructor(
    private eventRepository: EventRepository,
    private classValidator: ClassValidator,
    private sectionValidator: SectionValidator,
  ) { }

  async validate(data: any) {
    return eventSchema.parse(data);
  }

  async validateParticipant(data: any) {
    return eventParticipantSchema.parse(data);
  }


  async checkExists(id: string) {
    const event = await this.eventRepository.getById(id);
    if (!event) {
      throw new Error(t('events.errors.notFound'));
    }
    return event;
  }

  async validateClassAndSection(classId?: string, sectionId?: string) {
    if (classId) {
      await this.classValidator.checkExists(classId);
    }

    if (sectionId) {
      const section = await this.sectionValidator.checkExists(sectionId);

      // If both classId and sectionId are provided, validate they match
      if (classId && section.classId !== classId) {
        throw new Error(t('sections.errors.notInClass'));
      }
    }
  }

  async validateCapacity(eventId: string, additionalParticipants: number = 1) {
    const event = await this.checkExists(eventId);

    if (!event.capacity) {
      return true; // No capacity limit
    }

    const currentCount = await this.eventRepository.getParticipantCount(eventId);
    const newTotal = currentCount + additionalParticipants;

    if (newTotal > event.capacity) {
      throw new Error(t('events.errors.capacityFull', {
        capacity: event.capacity,
        current: currentCount
      }));
    }

    return true;
  }

  async validateRegistrationDeadline(eventId: string) {
    const event = await this.checkExists(eventId);

    if (!event.registrationRequired || !event.registrationDeadline) {
      return true; // No deadline
    }

    const today = new Date();
    const deadline = new Date(event.registrationDeadline);

    if (today > deadline) {
      throw new Error(t('events.errors.registrationClosed'));
    }

    return true;
  }

  async validateParticipantRegistration(eventId: string, participantId: string) {
    // Check if already registered
    const exists = await this.eventRepository.checkParticipantExists(eventId, participantId);
    if (exists) {
      throw new Error(t('events.errors.alreadyRegistered'));
    }

    // Validate capacity
    await this.validateCapacity(eventId);

    // Validate registration deadline
    await this.validateRegistrationDeadline(eventId);

    return true;
  }

  async validateBulkRegistration(eventId: string, participantIds: string[]) {
    // Check capacity for bulk registration
    await this.validateCapacity(eventId, participantIds.length);

    // Validate registration deadline
    await this.validateRegistrationDeadline(eventId);

    // Check for already registered participants
    const alreadyRegistered = [];
    for (const participantId of participantIds) {
      const exists = await this.eventRepository.checkParticipantExists(eventId, participantId);
      if (exists) {
        alreadyRegistered.push(participantId);
      }
    }

    if (alreadyRegistered.length > 0) {
      throw new Error(t('events.errors.someAlreadyRegistered', {
        count: alreadyRegistered.length
      }));
    }

    return true;
  }

  async validateEventStatus(eventId: string, allowedStatuses: string[]) {
    const event = await this.checkExists(eventId);

    if (!allowedStatuses.includes(event.status)) {
      throw new Error(t('events.errors.invalidStatus', {
        current: event.status,
        allowed: allowedStatuses.join(', ')
      }));
    }

    return true;
  }

  // ========================================
// EVENT_VALIDATIONS
// ========================================

async checkEndDateAfterStart(startDate: Date, endDate: Date) {
  if (endDate < startDate) {
    throw new Error(t('events.errors.endDateBeforeStart'));
  }
  return true;
}

async checkEndTimeAfterStartForSameDay(
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string
) {
  // Check if it's the same day
  const sameDay = startDate.toDateString() === endDate.toDateString();
  
  if (sameDay) {
    // Parse times (assuming HH:mm format)
    const start = startTime.split(':').map(Number);
    const end = endTime.split(':').map(Number);
    
    const startMinutes = start[0] * 60 + start[1];
    const endMinutes = end[0] * 60 + end[1];

    if (endMinutes <= startMinutes) {
      throw new Error(t('events.errors.endTimeBeforeStart'));
    }
  }
  return true;
}

async checkRegistrationDeadlineValid(
  registrationDeadline?: Date | null,
  startDate?: Date
) {
  if (!registrationDeadline || !startDate) {
    return true; // Skip validation if either date is missing
  }

  if (registrationDeadline > startDate) {
    throw new Error(t('events.errors.registrationDeadlineAfterStart'));
  }
  return true;
}

async checkClassIdRequiredForSection(sectionId?: string, classId?: string) {
  if (sectionId && !classId) {
    throw new Error(t('events.errors.classIdRequiredForSection'));
  }
  return true;
}

async validateEventDates(
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string,
  registrationDeadline?: Date | null
) {
  await this.checkEndDateAfterStart(startDate, endDate);
  await this.checkEndTimeAfterStartForSameDay(startDate, endDate, startTime, endTime);
  await this.checkRegistrationDeadlineValid(registrationDeadline, startDate);
  return true;
}
}
