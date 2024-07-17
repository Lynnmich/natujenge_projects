import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';

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
    return this.http.get(this.apiUrl + location);
  }

  getForecast(location: string): Observable<any> {
    return this.http.get(`${this.forecastUrl}?q=${location}&appid=${environment.apiKey}&units=metric`);
  }

  getWeatherByCoords(lat: number, lon: number): Observable<any> {
    const url = `${this.weatherUrl}?lat=${lat}&lon=${lon}&appid=${environment.apiKey}&units=metric`;
    return this.http.get<any>(url);
  }

  getForecastByCoords(lat: number, lon: number): Observable<any> {
    const url = `${this.forecastUrl}?lat=${lat}&lon=${lon}&appid=${environment.apiKey}&units=metric`;
    return this.http.get<any>(url);
  }

  getBackendWeatherData(): Observable<any> {
    return this.http.get(`${this.backendUrl}/weather`);
  }

  addBackendWeatherData(weatherData: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/weather/add`, weatherData);
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.backendUrl}/favorites`);
  }

  addFavorites(location: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/favorites/add`, { location });
  }

  deleteFavorites(id: number): Observable<any> {
    return this.http.delete(`${this.backendUrl}/favorites/delete/${id}`);
  }

  getHistory(location: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/history/${location}`);
  }

  addHistory(weatherData: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/history/add`, weatherData);
  }
  
  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    throw error;
  }
}
