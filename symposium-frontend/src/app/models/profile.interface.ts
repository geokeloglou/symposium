import { Guid } from 'guid-typescript';

export interface Profile {
  id: Guid;
  username: Guid;
  firstname: Guid;
  lastname: Date;
  email: string;
  registeredDate: Date;
  lastLogin: Date;
  intro: string;
  imageUrl: string;
}
