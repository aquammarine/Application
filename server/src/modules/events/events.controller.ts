import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: User) {
    return this.eventsService.create(createEventDto, user.id);
  }

  @Get('public')
  findAllPublic(@CurrentUser() user?: User) {
    return this.eventsService.findAllPublic(user?.id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  findAllMy(@CurrentUser() user: User) {
    return this.eventsService.findMyEvents(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user?: User) {
    return this.eventsService.findOne(id, user?.id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  join(@Param('id') id: string, @CurrentUser() user: User) {
    return this.eventsService.join(id, user.id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  leave(@Param('id') id: string, @CurrentUser() user: User) {
    return this.eventsService.leave(id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @CurrentUser() user: User) {
    return this.eventsService.update(id, updateEventDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.eventsService.remove(id, user.id);
  }
}
