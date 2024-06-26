import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '6e5dc98de2dbf14c7aea6d23e6292102';
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${this.apiKey}&units=metric&q=`;

  constructor(private http: HttpClient) { }

  getWeather(location: string): Observable<any> {
    return this.http.get(this.apiUrl + location);
  }
}