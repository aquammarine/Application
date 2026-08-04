import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { UpdateEventTagsDto } from './dto/update-event-tags.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { TagDto } from './dto/tag.dto';

@ApiTags('tags')
@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('tags')
  @ApiOperation({ summary: 'Get all available tags' })
  @ApiResponse({ status: 200, description: 'List of all tags' })
  async findAll(): Promise<TagDto[]> {
    return this.tagsService.findAll();
  }

  @Patch('events/:id/tags')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set tags on an event (organizer only, max 5)' })
  @ApiResponse({ status: 200, description: 'Tags updated successfully' })
  @ApiResponse({ status: 403, description: 'Not the organizer' })
  @ApiResponse({
    status: 422,
    description: 'Validation error (>5 tags or invalid IDs)',
  })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  async updateEventTags(
    @Param('id') eventId: string,
    @Body() dto: UpdateEventTagsDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.tagsService.updateEventTags(eventId, dto.tagIds, user.id);
  }
}
