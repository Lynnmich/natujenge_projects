import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SearchesService } from '../searches.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { WeatherService } from '../weather.service';

declare const bootstrap: any;

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
  deleteWeatherId: number | null = null;
  successMessage: string = '';

  constructor(private searchesService: SearchesService,
              private http: HttpClient,
              private router: Router,
              private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getSavedWeatherData();
  }

  getSavedWeatherData(): void {
    this.setLoadingState(true);

    this.searchesService.getAllWeatherData(this.page, this.perPage).subscribe(
      (response) => {
        setTimeout(() => {
          this.savedWeatherData = response.searches;
          this.total = response.total;
          this.setLoadingState(false);
        }, 3000);
      },
      (error) => {
        console.error('Error fetching weather data:', error);
        this.errorMessage = 'Failed to load weather data';
        setTimeout(() => {
          this.setLoadingState(false);
        }, 3000);
      }
    );
  }

  deleteWeather(id: number): void {
    this.setLoadingState(true);
    this.weatherService.deleteWeatherData(id).subscribe({
      next: (response) => {
        console.log('Delete successful', response);
        this.getSavedWeatherData(); // Reload the data after deletion
        setTimeout(() => {
          this.setLoadingState(false);
        }, 1000);
      },
      error: (error) => {
        console.error('There was an error during deletion', error);
        setTimeout(() => {
          this.setLoadingState(false);
        }, 1000);
      }
    });
  }

  viewWeather(location: string): void {
    this.setLoadingState(true);
    setTimeout(() => {
      this.router.navigate(['/weather-details', location]);
      this.setLoadingState(false);
    }, 3000);
  }

  firstPage(): void {
    if (this.page > 1 && !this.loading) {
      this.page = 1;
      this.getSavedWeatherData();
    }
  }

  previousPage(): void {
    if (this.page > 1 && !this.loading) {
      this.page--;
      this.getSavedWeatherData();
    }
  }

  nextPage(): void {
    if (this.page * this.perPage < this.total && !this.loading) {
      this.page++;
      this.getSavedWeatherData();
    }
  }

  lastPage(): void {
    const totalPages = this.getTotalPages();
    if (this.page < totalPages && !this.loading) {
      this.page = totalPages;
      this.getSavedWeatherData();
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.getTotalPages() && !this.loading) {
      this.page = pageNumber;
      this.getSavedWeatherData();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.perPage);
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  private setLoadingState(loading: boolean): void {
    this.loading = loading;
  }

  openDeleteModal(id: number): void {
    this.deleteWeatherId = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteWeatherModal'));
    modal.show();
  }

  confirmDeleteWeather(): void {
    if (this.deleteWeatherId !== null) {
      this.deleteWeather(this.deleteWeatherId);
      this.deleteWeatherId = null;
      this.successMessage = 'Details deleted successfully'; 
      setTimeout(() => {
        this.successMessage = ''; 
      }, 3000);
    }
  }
}
