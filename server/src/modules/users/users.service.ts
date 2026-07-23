import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User} from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) { }

  async create(dto: CreateUserDto): Promise<User> {
    return await this.usersRepository.create(dto)
  }

  async findById(id: string): Promise<User>{
    const user = await this.usersRepository.findById(id);

    if(!user){
      throw new NotFoundException("User doesn't exists");
    }

    return user;
  }
  
  async findAll(): Promise<User[] | null>{
    return await this.usersRepository.findAll();
  }

  async remove(id: string) {
    const user = await this.findById(id)

    await this.usersRepository.remove(user.id);
  }
}
