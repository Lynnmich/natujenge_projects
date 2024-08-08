import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${environment.apiKey}&q=`;
  private weatherUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl: string = 'https://api.openweathermap.org/data/2.5/forecast';
  private backendUrl: string = environment.backendUrl;

  constructor(private http: HttpClient) { }

  getWeather(location: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${location}`).pipe(
      catchError(this.handleError)
    );
  }

  getForecast(location: string): Observable<any> {
    return this.http.get(`${this.forecastUrl}?q=${location}&appid=${environment.apiKey}&units=metric`).pipe(
    );
  }

  getWeatherByCoords(lat: number, lon: number): Observable<any> {
    const url = `${this.weatherUrl}?lat=${lat}&lon=${lon}&appid=${environment.apiKey}&units=metric`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  getForecastByCoords(lat: number, lon: number): Observable<any> {
    const url = `${this.forecastUrl}?lat=${lat}&lon=${lon}&appid=${environment.apiKey}&units=metric`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  getBackendWeatherData(): Observable<any> {
    return this.http.get(`${this.backendUrl}/weather`).pipe(
      catchError(this.handleError)
    );
  }

  addBackendWeatherData(weatherData: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/weather/add`, weatherData).pipe(
      catchError(this.handleError)
    );
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.backendUrl}/favorites`).pipe(
      catchError(this.handleError)
    );
  }

  addFavorites(location: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/favorites/add`, { location }).pipe(
      catchError(this.handleError)
    );
  }

  deleteFavorites(id: number): Observable<any> {
    return this.http.delete(`${this.backendUrl}/favorites/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getHistory(location: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/history/${location}`).pipe(
      catchError(this.handleError)
    );
  }

  addHistory(weatherData: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/history/add`, weatherData).pipe(
      catchError(this.handleError)
    );
  }

  getAllWeatherData(): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/weather/all`).pipe(
      catchError(this.handleError)
    );
  }

  getWeatherByLocation(location: string): Observable<any> {
    return this.http.get(`${this.weatherUrl}?q=${location}&appid=${environment.apiKey}&units=metric`).pipe(
      catchError(this.handleError)
    );
  }

  deleteWeatherData(id: number): Observable<any> {
    return this.http.delete(`${this.backendUrl}/weather/delete/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('Something went wrong; please try again later.');
  }

  getWeeklyWeather(location: string): Observable<any> {
    return this.http.get<any>(`${this.weatherUrl}/forecast/daily?q=${location}&cnt=7&appid=${environment.apiKey}`);
  }

}

