import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";

export class RegisterResponseDto{
    @ApiProperty({type: User})
    user!: User
    
    @ApiProperty()
    accessToken!: string
}