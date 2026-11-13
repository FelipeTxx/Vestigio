
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Recupera o token salvo durante o login.
    const token = this.authService.getToken();

    // Sem token, a requisição segue normalmente.
    if (!token) {
      return next.handle(request);
    }

    // Adiciona o token ao cabeçalho da requisição.
    const requestClone = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(requestClone);
  }
}
