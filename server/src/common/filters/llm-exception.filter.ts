import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import {
  LlmEmptyResponseError,
  LlmRateLimitError,
  LlmRequestError,
  LlmTimeoutError,
} from 'src/infra/llm/llm.errors';

@Catch(
  LlmRateLimitError,
  LlmTimeoutError,
  LlmEmptyResponseError,
  LlmRequestError,
)
export class LlmExceptionFilter implements ExceptionFilter {
  catch(err: Error, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const map: Record<string, [number, string]> = {
      LlmRateLimitError: [
        429,
        "I'm recieving too many requests. Please try again in a moment.",
      ],
      LlmTimeoutError: [
        504,
        'The assistant is taking too long to respond. Please try again.',
      ],
      LlmEmptyResponseError: [
        502,
        'Sorry, the assistant is temporarily unavailable. Please try again later.',
      ],
      LlmRequestError: [
        502,
        'Sorry, the assistant is temporarily unavailable. Please try again later.',
      ],
    };
    const [status, message] = map[err.constructor.name];
    res.status(status).json({ statusCode: status, message });
  }
}
