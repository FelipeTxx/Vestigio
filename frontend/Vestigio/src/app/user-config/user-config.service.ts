import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserConfigService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getByUser(id: number){
    return this.http.get(`${this.apiUrl}/user_configs_by_user/${id}`).pipe(
      timeout({ first: 10000 }),
    );
  }

  update(config: any, id: any) {
    return this.http.put(`${this.apiUrl}/user_configs/${id}`, config);
  }

  updateUser(id: any, user: any){
    return this.http.put(`${this.apiUrl}/users/${id}`, user);
  }

}
