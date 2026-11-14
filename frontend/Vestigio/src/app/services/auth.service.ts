import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Endereço da API Laravel.
  readonly apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Envia as credenciais e armazena o token recebido.
  login(user: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/login`, user).pipe(

      // Executa quando o Laravel responde com sucesso.
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      })

    );
  }

  // Recupera o token armazenado.
  getToken(): string | null {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem('token');
  }

  // Verifica se existe um token armazenado.
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Solicita os dados do usuário autenticado.
  me(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  // Realiza logout e remove o token local.
  logout(): Observable<any> {

    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(

      // Remove o token mesmo se a requisição falhar.
      finalize(() => {
        this.clearToken();
      })

    );
  }
}
