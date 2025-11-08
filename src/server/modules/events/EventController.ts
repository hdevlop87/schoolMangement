import { Controller, Get, Post, Put, Delete, Params, Body, t, Filter, User } from 'najm-api';
import { EventService } from './EventService';
import { isAdmin } from '../roles';
import {
  canAccessEvent,
  canAccessAllEvents,
  canCreateEvent,
  canUpdateEvent,
  canDeleteEvent,
  canManageParticipants,
} from './EventGuards';

@Controller('/events')
export class EventController {
  constructor(
    private eventService: EventService,
  ) { }

  // ========== EVENT ENDPOINTS ==========//

  @Get()
  @canAccessAllEvents()
  async getEvents(@Filter() filter) {
    const events = await this.eventService.getAll(filter);
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/upcoming')
  async getUpcoming() {
    const events = await this.eventService.getUpcoming();
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/past')
  async getPast() {
    const events = await this.eventService.getPast();
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/active')
  async getActive() {
    const events = await this.eventService.getActiveEvents();
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/status/:status')
  @canAccessAllEvents()
  async getByStatus(@Params('status') status) {
    const events = await this.eventService.getByStatus(status);
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/type/:type')
  async getByType(@Params('type') type) {
    const events = await this.eventService.getByType(type);
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/organizer/:organizerId')
  @canAccessAllEvents()
  async getByOrganizer(@Params('organizerId') organizerId) {
    const events = await this.eventService.getByOrganizer(organizerId);
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/class/:classId')
  async getByClass(@Params('classId') classId) {
    const events = await this.eventService.getByClass(classId);
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/section/:sectionId')
  async getBySection(@Params('sectionId') sectionId) {
    const events = await this.eventService.getBySection(sectionId);
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/visibility/:visibility')
  @canAccessAllEvents()
  async getByVisibility(@Params('visibility') visibility) {
    const events = await this.eventService.getByVisibility(visibility);
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/date-range')
  async getByDateRange(@Body() body) {
    const { startDate, endDate } = body;
    const events = await this.eventService.getByDateRange(startDate, endDate);
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics')
  @isAdmin()
  async getAnalytics() {
    const analytics = await this.eventService.getEventAnalytics();
    return {
      data: analytics,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/analytics/type-count')
  @isAdmin()
  async getTypeCount() {
    const typeCount = await this.eventService.getEventsByTypeCount();
    return {
      data: typeCount,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id')
  @canAccessEvent()
  async getEvent(@Params('id') id) {
    const event = await this.eventService.getById(id);
    return {
      data: event,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Post()
  @canCreateEvent()
  async create(@Body() body, @User() user) {
    const newEvent = await this.eventService.create({
      ...body,
      organizerId: user.id,
    });
    return {
      data: newEvent,
      message: t('events.success.created'),
      status: 'success'
    };
  }

  @Put('/:id')
  @canUpdateEvent()
  async update(@Params('id') id, @Body() body) {
    const updatedEvent = await this.eventService.update(id, body);
    return {
      data: updatedEvent,
      message: t('events.success.updated'),
      status: 'success'
    };
  }

  @Delete('/:id')
  @canDeleteEvent()
  async delete(@Params('id') id) {
    const result = await this.eventService.delete(id);
    return {
      data: result,
      message: t('events.success.deleted'),
      status: 'success'
    };
  }

  @Delete()
  @isAdmin()
  async deleteAll() {
    const result = await this.eventService.deleteAll();
    return {
      data: result,
      message: t('events.success.allDeleted'),
      status: 'success'
    };
  }

  // ========== EVENT STATUS ENDPOINTS ==========//

  @Post('/:id/start')
  @canUpdateEvent()
  async startEvent(@Params('id') id) {
    const event = await this.eventService.startEvent(id);
    return {
      data: event,
      message: t('events.success.started'),
      status: 'success'
    };
  }

  @Post('/:id/complete')
  @canUpdateEvent()
  async completeEvent(@Params('id') id) {
    const event = await this.eventService.completeEvent(id);
    return {
      data: event,
      message: t('events.success.completed'),
      status: 'success'
    };
  }

  @Post('/:id/cancel')
  @canUpdateEvent()
  async cancelEvent(@Params('id') id) {
    const event = await this.eventService.cancelEvent(id);
    return {
      data: event,
      message: t('events.success.cancelled'),
      status: 'success'
    };
  }

  @Post('/:id/postpone')
  @canUpdateEvent()
  async postponeEvent(@Params('id') id, @Body() body) {
    const { newStartDate, newEndDate } = body;
    const event = await this.eventService.postponeEvent(id, newStartDate, newEndDate);
    return {
      data: event,
      message: t('events.success.postponed'),
      status: 'success'
    };
  }

  // ========== PARTICIPANT ENDPOINTS ==========//

  @Get('/:id/participants')
  @canAccessEvent()
  async getParticipants(@Params('id') id) {
    const participants = await this.eventService.getParticipants(id);
    return {
      data: participants,
      message: t('events.success.participantsRetrieved'),
      status: 'success'
    };
  }

  @Get('/:id/participants/:type')
  @canAccessEvent()
  async getParticipantsByType(@Params('id') id, @Params('type') type) {
    const participants = await this.eventService.getParticipantsByType(id, type);
    return {
      data: participants,
      message: t('events.success.participantsRetrieved'),
      status: 'success'
    };
  }

  @Get('/participant/:participantId')
  async getEventsByParticipant(@Params('participantId') participantId) {
    const events = await this.eventService.getEventsByParticipant(participantId);
    return {
      data: events,
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Get('/:id/participants/count')
  @canAccessEvent()
  async getParticipantCount(@Params('id') id) {
    const count = await this.eventService.getParticipantCount(id);
    return {
      data: { count },
      message: t('events.success.retrieved'),
      status: 'success'
    };
  }

  @Post('/participants')
  @canManageParticipants()
  async addParticipant(@Body() body) {
    const participant = await this.eventService.addParticipant(body);
    return {
      data: participant,
      message: t('events.success.participantAdded'),
      status: 'success'
    };
  }

  @Put('/participants/:id')
  @canManageParticipants()
  async updateParticipant(@Params('id') id, @Body() body) {
    const participant = await this.eventService.updateParticipant(id, body);
    return {
      data: participant,
      message: t('events.success.participantUpdated'),
      status: 'success'
    };
  }

  @Delete('/participants/:id')
  @canManageParticipants()
  async removeParticipant(@Params('id') id) {
    const result = await this.eventService.removeParticipant(id);
    return {
      data: result,
      message: t('events.success.participantRemoved'),
      status: 'success'
    };
  }

  @Post('/participants/:id/attendance')
  @canManageParticipants()
  async markAttendance(@Params('id') id, @Body() body) {
    const { status } = body;
    const participant = await this.eventService.markAttendance(id, status);
    return {
      data: participant,
      message: t('events.success.attendanceMarked'),
      status: 'success'
    };
  }
}
