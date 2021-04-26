import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  token!: string;

  constructor(private jwtHelperService: JwtHelperService) {
  }

  tokenExpired(): boolean {
    this.token = localStorage.getItem('token') || '';
    if (this.jwtHelperService.isTokenExpired(this.token)) {
      return true;
    }
    return false;
  }

  parseJwt(token: string): any {
    let base64Url: string;
    base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

}
