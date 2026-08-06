import { ApiProperty } from '@nestjs/swagger';
import type { User } from 'src/common/interfaces/user.interface';

export class RegisterResponseDto {
  @ApiProperty()
  user!: User;

  @ApiProperty()
  accessToken!: string;
}
