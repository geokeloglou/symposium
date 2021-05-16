import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { LoginRequest } from '../models/authentication.interface';
import { TokenService } from './token.service';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ApiResponse } from '../models/http.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {

  baseUrl = environment.baseUrl;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    super();
  }

  login(user: LoginRequest): Observable<ApiResponse> {
    return this.httpClient
      .post<ApiResponse>(`${ this.baseUrl }/api/auth/login`, user)
      .pipe(
        tap((response: ApiResponse) => this.doLoginUser(response)),
        catchError((error) => this.handleError(error))
      );
  }

  register(user: any): Observable<ApiResponse> {
    return this.httpClient
      .post<ApiResponse>(`${ this.baseUrl }/api/auth/register`, user)
      .pipe(
        tap(() => this.router.navigate(['login'])),
        catchError((error) => this.handleError(error))
      );
  }

  forgotPassword(email: string): Observable<boolean | ApiResponse> {
    return this.httpClient
      .post<ApiResponse>(
        `${ this.baseUrl }/api/auth/forgot`,
        email
      )
      .pipe(
        tap(() => this.router.navigate(['login'])),
        catchError(() => this.router.navigate(['login']))
      );
  }

  resetPassword(body: { token: string; password: string }): Observable<ApiResponse> {
    return this.httpClient
      .post<ApiResponse>(`${ this.baseUrl }/api/auth/reset`, body)
      .pipe(
        tap(() => this.router.navigate(['login'])),
        catchError((error) => this.handleError(error)));
  }

  isLoggedIn(): boolean {
    return !this.tokenService.tokenExpired();
  }

  getJwtToken(): string | null {
    return localStorage.getItem('token');
  }

  removeJwtToken(): void {
    localStorage.removeItem('token');
  }

  doLogout(): void {
    this.removeJwtToken();
  }

  logout(): Promise<boolean> {
    this.removeJwtToken();
    return this.router.navigate(['/login']);
  }

  private doLoginUser(response: ApiResponse): void {
    if (response.data !== null && response.data !== undefined) {
      this.storeToken(response.data.toString());
    }
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }
}
