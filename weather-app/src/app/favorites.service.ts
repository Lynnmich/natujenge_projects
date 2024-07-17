import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://127.0.0.1:5000/favorites';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteFavorite(id: number): Observable<any> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<any>(url);
  }
}
