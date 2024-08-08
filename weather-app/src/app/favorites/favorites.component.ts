import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { FavoritesService } from '../favorites.service';
import { Router } from '@angular/router';
import { WeatherService } from '../weather.service';

declare const bootstrap: any;

@Component({
  selector: 'app-favorites',
  standalone: true,
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  providers: [FavoritesService, WeatherService]
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  notification: string = '';
  loading = true;
  showConfirmationDialog = false;
  deleteFavoriteId: number | null = null;
  weatherData: any = null; 
  localTime: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private favoritesService: FavoritesService,
    private router: Router,
    private weatherService: WeatherService,
    //private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.loading = true; // Set loading to true before fetching data
    this.favoritesService.getFavorites().subscribe(
      (data) => {
        setTimeout(() => { // Simulate a delay
          this.favorites = data;
          this.loading = false; // Set loading to false after the delay
        }, 1000); // 1000ms = 1 second delay
      },
      (error) => {
        console.error('Error fetching favorites', error);
        setTimeout(() => { // Simulate a delay
          this.loading = false; // Set loading to false after the delay
        }, 1000); // 1000ms = 1 second delay
      }
    );
  }

  viewWeather(location: string): void {
    this.loading = true;
    this.favoritesService.getWeatherDetails(location).subscribe(
      (data: any) => {
        this.loading = false;
        this.weatherData = data;
        this.localTime = this.formatLocalTime(data.city.timezone);
        this.isLoading = false;
        const modal = new bootstrap.Modal(document.getElementById('weatherDetailsModal'));
        modal.show();
      },
      (error: any) => {
        console.error('Error fetching weather details', error);
        this.loading = false;
      }
    );
  }  

    private formatLocalTime(timezoneOffset: number): string {
    const now = new Date();
    const localTime = new Date(now.getTime() + timezoneOffset * 1000);
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  deleteFavorite(id: number): void {
    this.favoritesService.deleteFavorite(id).subscribe(
      () => {
        this.notification = 'Favorite location deleted successfully!';
        this.loadFavorites();
        setTimeout(() => {
          this.notification = '';
        }, 3000);
      },
      error => {
        console.error('Error deleting favorite location', error);
        this.notification = 'Failed to delete favorite location';
      }
    );
  }
  
  openDeleteModal(id: number): void {
    this.deleteFavoriteId = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteFavoriteModal'));
    modal.show();
  }

  confirmDeleteFavorite(): void {
    if (this.deleteFavoriteId !== null) {
      this.deleteFavorite(this.deleteFavoriteId);
      this.deleteFavoriteId = null;
    }
  } 
}
