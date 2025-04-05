import { Document } from 'mongoose';

export interface UsersInterface extends Document {
  readonly first_name: string;
  readonly last_name: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly status: boolean;
}

export interface UserResponseInterface {
  readonly user_id: string;
  readonly requestId: string;
}
