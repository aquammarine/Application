import { User } from 'src/common/interfaces/user.interface';

type UserWithPassword = User & { password: string };

export type { UserWithPassword };
