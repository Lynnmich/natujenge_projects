import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  providers: [FavoritesService]
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  notification: string = '';
  loading = true;

  constructor(private favoritesService: FavoritesService) {}

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


  deleteFavorite(id: number): void {
    this.favoritesService.deleteFavorite(id).subscribe(
      () => {
        this.notification = 'Favorite location deleted successfully!';
        this.loadFavorites(); // Reload favorites after deletion
        setTimeout(() => {
          this.notification = ''; // Clear notification after 3 seconds
        }, 3000);
      },
      error => {
        console.error('Error deleting favorite location', error);
        this.notification = 'Failed to delete favorite location';
      }
    );
  }
}

