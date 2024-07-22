import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SearchesService } from '../searches.service';

@Component({
  selector: 'app-saved-locations',
  standalone: true,
  templateUrl: './saved-locations.component.html',
  styleUrls: ['./saved-locations.component.css'],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  providers: [SearchesService]
})
export class SavedLocationsComponent implements OnInit {
  savedWeatherData: any[] = [];
  errorMessage!: string;
  page: number = 1;
  perPage: number = 6;
  total: number = 0;
  isCelsius: boolean = true; 

  constructor(private searchesService: SearchesService) {}

  ngOnInit(): void {
    this.getSavedWeatherData();
  }

  getSavedWeatherData(): void {
    this.searchesService.getAllWeatherData(this.page, this.perPage).subscribe(
      (response) => {
        this.savedWeatherData = response.searches;
        this.total = response.total;
      },
      (error) => {
        console.error('Error fetching weather data:', error);
        this.errorMessage = 'Failed to load weather data';
      }
    );
  }
}
