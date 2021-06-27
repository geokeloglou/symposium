import { Guid } from 'guid-typescript';

export interface CreatePost {
  text: string;
  imageUrl?: string;
}

export interface Post {
  id: Guid;
  text: string;
  createdDate: Date;
  updatedDate: Date;
  likes: number;
  archived: boolean;
  postImageUrl: string;
}


export interface PostData {
  userId: Guid;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  userImageUrl: string;
  postId: Guid;
  text: string;
  createdDate: Date;
  updatedDate: Date;
  likes: number;
  archived: boolean;
  postImageUrl: string;
}
