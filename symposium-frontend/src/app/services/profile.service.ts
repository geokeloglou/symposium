import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/http.interface';

@Injectable()
export class ProfileService extends BaseService {

  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {
    super();
  }

  getUserProfileInfo(): Observable<ApiResponse> {
    return this.httpClient.get<ApiResponse>(`${ this.apiUrl }/profile/info`);
  }

}
