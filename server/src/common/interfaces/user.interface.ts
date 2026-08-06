interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface PublicUser {
  id: string;
  firstName: string;
  lastName: string;
}

interface Participant {
  joinedAt: Date;
  user: PublicUser;
}

export type { Participant, User, PublicUser };
