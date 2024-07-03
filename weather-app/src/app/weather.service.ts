import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${environment.apiKey}&q=`;
  private weatherUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  private forecastUrl: string = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient) { }

  getWeather(location: string): Observable<any> {
    return this.http.get(this.apiUrl + location);
  }

  getForecast(location: string): Observable<any> {
    return this.http.get(`${environment.forecastUrl}?q=${location}&appid=${environment.apiKey}&units=metric`);
  }

  getWeatherByCoords(lat: number, lon: number): Observable<any> {
    const url = `${this.weatherUrl}?lat=${lat}&lon=${lon}&appid=${environment.apiKey}&units=metric`;
    return this.http.get<any>(url);
  }

  getForecastByCoords(lat: number, lon: number): Observable<any> {
    const url = `${this.forecastUrl}?lat=${lat}&lon=${lon}&appid=${environment.apiKey}&units=metric`;
    return this.http.get<any>(url);
  }
}
