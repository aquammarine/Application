import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { UpdateEventTagsDto } from './dto/update-event-tags.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('tags')
@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get('tags')
  @ApiOperation({ summary: 'Get all available tags' })
  @ApiResponse({ status: 200, description: 'List of all tags' })
  async findAll() {
    return await this.tagsService.findAll();
  }

  @Patch('events/:id/tags')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set tags on an event (organizer only, max 5)' })
  @ApiResponse({ status: 200, description: 'Tags updated successfully' })
  @ApiResponse({ status: 403, description: 'Not the organizer' })
  @ApiResponse({ status: 422, description: 'Validation error (>5 tags or invalid IDs)' })
  @ApiParam({ name: 'id', description: 'Event UUID' })
  async updateEventTags(
    @Param('id') eventId: string,
    @Body() dto: UpdateEventTagsDto,
    @Request() req: { user: { id: string } },
  ) {
    await this.tagsService.updateEventTags(eventId, dto.tagIds, req.user.id);
    return { message: 'Tags updated successfully' };
  }
}
