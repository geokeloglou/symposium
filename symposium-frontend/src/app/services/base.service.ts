import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export abstract class BaseService {
  protected handleError(error: HttpErrorResponse): Observable<never> {
    if (!environment.production) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Error \n` +
          `status: ${ error.status } \n` +
          `statusText: ${ error.statusText } \n` +
          `url: ${ error.url } \n` +
          `ok: ${ error.ok } \n` +
          `name: ${ error.name } \n` +
          `message: ${ error.message } \n`);
      }
    }
    // Return an observable with a user-facing error message.
    return throwError(error);
  }
}
