import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/http.interface';
import { CreatePost, DeletePost, LikePost } from '../models/post.interface';

@Injectable()
export class PostService extends BaseService {

  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
    super();
  }

  getAllPosts(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(`${ this.apiUrl }/post/get-all`);
  }

  createPost(post: CreatePost): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('text', post.text);
    formData.append('postImage', post.postImage);
    return this.httpClient.post<ApiResponse>(`${ this.apiUrl }/post/create`, formData);
  }

  deletePost(post: DeletePost): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(`${ this.apiUrl }/post/delete`, post);
  }

  likePost(post: LikePost): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(`${ this.apiUrl }/post/like`, post);
  }

  getAllLikedPosts(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(`${ this.apiUrl }/post/liked/get-all`);
  }

}
