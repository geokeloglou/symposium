import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/http.interface';
import { CreatePost, LikePost } from '../models/post.interface';

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
    return this.httpClient.post<ApiResponse>(`${ this.apiUrl }/post/create`, post);
  }

  likePost(post: LikePost): Observable<ApiResponse> {
    return this.httpClient.post<ApiResponse>(`${ this.apiUrl }/post/like`, post);
  }

  getAllLikedPosts(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(`${ this.apiUrl }/post/liked/get-all`);
  }

}
