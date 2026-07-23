import { User } from '../entities/user.entity';

type UserWithPassword = User & { password: string };

export type { UserWithPassword };
