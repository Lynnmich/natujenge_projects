import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://127.0.0.1:5000/favorites';
  private forecastUrl: string = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteFavorite(id: number): Observable<any> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<any>(url);
  }
  getWeatherDetails(cityName: string): Observable<any> {
    const url = `${this.forecastUrl}&appid=${environment.apiKey}${cityName}`;
    return this.http.get<any>(url);
  }

}
