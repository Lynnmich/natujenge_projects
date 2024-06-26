import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${environment.weatherApiKey}&q=`;

  constructor(private http: HttpClient) { }

  getWeather(location: string): Observable<any> {
    return this.http.get(this.apiUrl + location);
  }
}