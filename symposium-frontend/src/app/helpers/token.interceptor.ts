import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotifierService } from '../services/notifier.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
    private notifierService: NotifierService
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${ this.auth.getJwtToken() }`,
      },
    });

    return next.handle(request).pipe(
      tap(
        () => {
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.notifierService.showNotification(
              'Παρακαλώ ξανασυνδεθείτε.',
              'OK',
              'error'
            );
            this.auth.removeJwtToken();
            this.router.navigate(['login']);
          }
        }
      )
    );
  }
}
