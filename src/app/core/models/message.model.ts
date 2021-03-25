import {User} from './user.model';

export interface Message {
  id: number;
  sender: User;
  receiver: User;
  text: string;
  dateTime: Date;
}
