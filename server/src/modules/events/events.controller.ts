import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import type { User } from '@prisma/client';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event successfully created.' })
  async create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: User) {
    return await this.eventsService.create(createEventDto, user.id);
  }

  @Get('public')
  @ApiOperation({ summary: 'List all public events' })
  @ApiResponse({ status: 200, description: 'Return all public events.' })
  async findAllPublic(@CurrentUser() user?: User) {
    return await this.eventsService.findAllPublic(user?.id);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List events organized or joined by the current user' })
  @ApiResponse({ status: 200, description: 'Return user events.' })
  async findAllMy(@CurrentUser() user: User) {
    return await this.eventsService.findMyEvents(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event details by ID' })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  @ApiResponse({ status: 200, description: 'Return event details.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async findOne(@Param('id') id: string, @CurrentUser() user?: User) {
    return await this.eventsService.findOne(id, user?.id);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Join an event' })
  @ApiResponse({ status: 200, description: 'Successfully joined event.' })
  @ApiResponse({ status: 400, description: 'Event is full or already joined.' })
  async join(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.eventsService.join(id, user.id);
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Leave an event' })
  @ApiResponse({ status: 200, description: 'Successfully left event.' })
  async leave(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.eventsService.leave(id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event details' })
  @ApiResponse({ status: 200, description: 'Event successfully updated.' })
  @ApiResponse({ status: 403, description: 'Not authorized to update this event.' })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @CurrentUser() user: User) {
    return await this.eventsService.update(id, updateEventDto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({ status: 204, description: 'Event successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this event.' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.eventsService.remove(id, user.id);
  }
}
