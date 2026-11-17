import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // <-- Isso diz ao Angular para disponibilizar o serviço globalmente
})
export class DiarioService {

private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  create(diario: any) {
    return this.http.post(`${this.apiUrl}/diarios`, {diario});
  }

  update(diario: any) {
    return this.http.put(`${this.apiUrl}/diarios`, {diario});
  }

  getByUser(id: number){
    return this.http.get(`${this.apiUrl}/diarios-by-user/${id}`);
  }

  destroy(id: number){
    return this.http.delete(`${this.apiUrl}/diarios/${id}`);
  }

}
