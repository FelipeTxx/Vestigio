import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

   private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  verify() {
    return this.http.get(`${this.apiUrl}/me`);
  }

}