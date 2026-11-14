import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isApiRequest = request.url === this.authService.apiUrl
      || request.url.startsWith(`${this.authService.apiUrl}/`);
    const token = isApiRequest ? this.authService.getToken() : null;
    let authenticatedRequest = request;

    if (isApiRequest) {
      authenticatedRequest = request.clone({
        setHeaders: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
    }

    return next.handle(authenticatedRequest).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && token) {
          this.authService.clearToken();
          void this.router.navigate(['/login'], {
            queryParams: { sessionExpired: '1' }
          });
        }

        return throwError(() => error);
      })
    );
  }
}
