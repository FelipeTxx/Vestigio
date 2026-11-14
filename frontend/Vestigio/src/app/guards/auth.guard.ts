import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | UrlTree {

    // Verifica se existe um token armazenado.
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    // Confirma no servidor que o token continua válido antes de abrir a rota.
    return this.authService.me().pipe(
      map(() => true),
      catchError(() => of(this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      })))
    );
  }
}
