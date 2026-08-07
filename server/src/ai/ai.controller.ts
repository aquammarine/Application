import { Controller, Post, Body, UseGuards, UseFilters } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AiService } from 'src/ai/ai.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { User } from 'src/common/interfaces/user.interface';
import { LlmExceptionFilter } from 'src/common/filters/llm-exception.fileter';

@ApiTags('ai')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@UseFilters(LlmExceptionFilter)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  @ApiOperation({
    summary: 'Ask a natural-language question about your events',
  })
  @ApiResponse({
    status: 200,
    description: 'Answer from the AI assistant',
    schema: { type: 'object', properties: { answer: { type: 'string' } } },
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async ask(@Body('question') question: string, @CurrentUser() user: User) {
    const answer = await this.aiService.ask(question, user.id);
    return { answer };
  }
}
