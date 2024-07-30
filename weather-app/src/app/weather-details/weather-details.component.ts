import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.css'],
  standalone: true,
  imports: [
    NgbModule,
    NavbarComponent,
    CommonModule
  ]
})
export class WeatherDetailsComponent implements OnInit {
  weatherData: any;
  errorMessage: string | null = null;
  currentDateTime: any;
  localTime: string | null = null;
  forecastData: any;
  filteredForecastData: any[] = [];
  iconUrl: string = '';
  isCelsius: boolean = true;
  lowTemperature: number | null = null;
  highTemperature: number | null = null;
  hourlyForecast: any[] = [];
  isLoading: boolean = false; // Add loading state
  notification: string = '';
  humidity: number | null = null;
  windSpeed: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      // You might use params if you are using URL parameters; otherwise, you use state
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.weatherData = navigation.extras.state['weatherData'];
      this.iconUrl = `path_to_icon_based_on_weather_data`; // Update as needed
    }
  }



  goBack() {
    this.router.navigate(['/']);
  }
}
