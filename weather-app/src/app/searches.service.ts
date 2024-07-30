import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchesService {
  private apiUrl = 'http://127.0.0.1:5000/weather/all';

  constructor(private http: HttpClient) { }

  getAllWeatherData(page: number, perPage: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&per_page=${perPage}`);
  }

  getWeatherDetails(location: string): Observable<any> {
    return this.http.get<any>(`${environment.backendUrl}/weather/${location}`);
  }
  
}
