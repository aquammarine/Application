import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class ParseTagIdsPipe implements PipeTransform<
  string | undefined,
  string[] | undefined
> {
  transform(
    value: string | undefined,
    metadata: ArgumentMetadata,
  ): string[] | undefined {
    if (!value) return undefined;

    const ids = value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    if (!ids.every((id) => isUUID(id, 4))) {
      throw new BadRequestException(
        'Tags myst be a comma-separated list of UUIDs',
      );
    }
    return ids;
  }
}
