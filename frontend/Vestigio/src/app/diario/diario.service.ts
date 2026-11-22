import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Diary, DiaryInput, DiaryPageEntry, DiaryPageInput } from './diario.models';

@Injectable({ providedIn: 'root' })
export class DiarioService {
  private readonly apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  listDiaries(): Observable<Diary[]> {
    return this.http.get<Diary[]>(`${this.apiUrl}/diarios`);
  }

  getDiary(id: number): Observable<Diary> {
    return this.http.get<Diary>(`${this.apiUrl}/diarios/${id}`);
  }

  createDiary(diary: DiaryInput): Observable<Diary> {
    return this.http.post<Diary>(`${this.apiUrl}/diarios`, { diario: diary });
  }

  updateDiary(diary: Partial<DiaryInput>, id: number): Observable<Diary> {
    return this.http.put<Diary>(`${this.apiUrl}/diarios/${id}`, { diario: diary });
  }

  deleteDiary(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/diarios/${id}`);
  }

  listPages(diaryId: number): Observable<DiaryPageEntry[]> {
    return this.http.get<DiaryPageEntry[]>(`${this.apiUrl}/diarios/${diaryId}/pages`);
  }

  getPage(id: number): Observable<DiaryPageEntry> {
    return this.http.get<DiaryPageEntry>(`${this.apiUrl}/pages/${id}`);
  }

  createPage(diaryId: number, page: DiaryPageInput): Observable<DiaryPageEntry> {
    return this.http.post<DiaryPageEntry>(`${this.apiUrl}/diarios/${diaryId}/pages`, { page });
  }

  updatePage(page: Partial<DiaryPageInput>, id: number): Observable<DiaryPageEntry> {
    return this.http.put<DiaryPageEntry>(`${this.apiUrl}/pages/${id}`, { page });
  }

  deletePage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pages/${id}`);
  }
}
