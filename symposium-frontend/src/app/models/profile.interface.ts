import { Guid } from 'guid-typescript';

export interface Profile {
  id: Guid;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  registeredDate: Date;
  lastLogin: Date;
  intro: string;
  imageUrl: string;
}
