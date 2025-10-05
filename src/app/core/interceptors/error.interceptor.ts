import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/root/app.state';
import * as SharedActions from '../../store/shared/shared.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = 'Bad Request - Please check your input';
              break;
            case 401:
              errorMessage = 'Unauthorized - Please log in again';
              break;
            case 403:
              errorMessage = 'Forbidden - You do not have permission';
              break;
            case 404:
              errorMessage = 'Not Found - The requested resource was not found';
              break;
            case 500:
              errorMessage = 'Internal Server Error - Please try again later';
              break;
            case 0:
              errorMessage = 'Network Error - Please check your connection';
              break;
            default:
              errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
          }
        }

        // Dispatch error notification
        this.store.dispatch(
          SharedActions.showNotification({
            type: 'error',
            title: 'Error',
            message: errorMessage,
            duration: 5000,
          })
        );

        // Set error in shared state
        this.store.dispatch(
          SharedActions.setError({
            error: errorMessage,
            errorType: 'http',
          })
        );

        return throwError(() => error);
      })
    );
  }
}
