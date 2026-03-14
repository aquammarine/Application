import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AssistantService } from './assistant.service';
import { AskQuestionDto } from './dto/ask-question.dto';

@ApiTags('assistant')
@Controller('assistant')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) { }

  @Post()
  @ApiOperation({ summary: 'Ask a natural-language question about your events' })
  @ApiBody({ type: AskQuestionDto })
  @ApiResponse({
    status: 200,
    description: 'Answer from the AI assistant',
    schema: { type: 'object', properties: { answer: { type: 'string' } } },
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 422, description: 'Question too short or too long' })
  async ask(@Body() dto: AskQuestionDto, @Request() req: { user: { id: string } }) {
    const answer = await this.assistantService.ask(dto.question, req.user.id);
    return { answer };
  }
}
