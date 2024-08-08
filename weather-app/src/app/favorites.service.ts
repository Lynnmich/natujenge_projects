import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://127.0.0.1:5000/favorites';
  private forecastUrl: string = 'https://api.openweathermap.org/data/2.5/forecast';
  private weatherUrl: string = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteFavorite(id: number): Observable<any> {
    const url = `${this.apiUrl}/delete/${id}`;
    return this.http.delete<any>(url);
  }
  getWeatherDetails(cityName: string): Observable<any> {
    const url = `${this.forecastUrl}?q=${cityName}&appid=${environment.apiKey}&units=metric`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('Something went wrong; please try again later.');
  }

  getWeatherByLocation(location: string): Observable<any> {
    return this.http.get(`${this.weatherUrl}?q=${location}&appid=${environment.apiKey}&units=metric`).pipe(
      catchError(this.handleError)
    );
  }
}
