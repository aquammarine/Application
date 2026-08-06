import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithPassword } from './interfaces/user.interface';
import { User } from 'src/common/interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dto: CreateUserDto): Promise<User> {
    return await this.usersRepository.create(dto);
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException("User doesn't exist");
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserWithPassword | null> {
    const user = await this.usersRepository.findByEmail(email);
    return user;
  }

  async remove(id: string) {
    const user = await this.findById(id);

    await this.usersRepository.remove(user.id);
  }
}
