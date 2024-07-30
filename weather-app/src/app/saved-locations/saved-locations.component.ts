import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SearchesService } from '../searches.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-saved-locations',
  standalone: true,
  templateUrl: './saved-locations.component.html',
  styleUrls: ['./saved-locations.component.css'],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  providers: [
    SearchesService,
    WeatherService
  ]
})
export class SavedLocationsComponent implements OnInit {
  savedWeatherData: any[] = [];
  errorMessage!: string;
  page: number = 1;
  perPage: number = 6;
  total: number = 0;
  isCelsius: boolean = true; 
  loading = false;

  constructor(private searchesService: SearchesService,
    private http: HttpClient,
    private router: Router,
    private weatherService: WeatherService
  ) {}

  ngOnInit(): void {
    this.getSavedWeatherData();
  }

  getSavedWeatherData(): void {
    this.setLoadingState(true);

    this.searchesService.getAllWeatherData(this.page, this.perPage).subscribe(
      (response) => {
        setTimeout(() => { // Simulate a delay
          this.savedWeatherData = response.searches;
          this.total = response.total;
          this.setLoadingState(false);
        }, 3000); 
      },
      (error) => {
        console.error('Error fetching weather data:', error);
        this.errorMessage = 'Failed to load weather data';
        setTimeout(() => { // Simulate a delay
          this.setLoadingState(false);
        }, 3000); 
      }
    );
  }

  deleteWeather(id: number) {
    this.setLoadingState(true);
    this.weatherService.deleteWeatherData(id).subscribe({
      next: (response) => {
        console.log('Delete successful', response);
        // Remove the deleted item from the list
        this.savedWeatherData = this.savedWeatherData.filter(weather => weather.id !== id);
        setTimeout(() => { // Simulate a delay
          this.setLoadingState(false);
        }, 1000); // 1000ms = 1 second delay
      },
      error: (error) => {
        console.error('There was an error during deletion', error);
        setTimeout(() => { // Simulate a delay
          this.setLoadingState(false);
        }, 1000); // 1000ms = 1 second delay
      }
    });
  }

  viewWeather(location: string): void {
    this.setLoadingState(true);
    // Simulate loading delay
    setTimeout(() => {
      this.router.navigate(['/weather-details', location]);
      this.setLoadingState(false);
    }, 3000); // 3-second delay
  }

  previousPage(): void {
    if (this.page > 1 && !this.loading) {
      this.setLoadingState(true);
      setTimeout(() => {
        this.page--;
        this.getSavedWeatherData();
      }, 3000); // 3-second delay
    }
  }

  nextPage(): void {
    if (this.page * this.perPage < this.total && !this.loading) {
      this.setLoadingState(true);
      setTimeout(() => {
        this.page++;
        this.getSavedWeatherData();
      }, 3000); // 3-second delay
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.getTotalPages() && !this.loading) {
      this.page = pageNumber;
      this.setLoadingState(true);
      setTimeout(() => {
        this.getSavedWeatherData();
      }, 3000); // 3-second delay
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.perPage);
  }

  private setLoadingState(loading: boolean): void {
    this.loading = loading;
  }
}
