import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WeatherService } from '../weather.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import moment from 'moment-timezone';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    NgbModule 
  ],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  providers: [WeatherService, DatePipe]
})
export class WeatherComponent implements OnInit {
  public weatherSearchForm!: FormGroup;
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

  constructor(
    private formBuilder: FormBuilder,
    private weatherService: WeatherService,
    private datePipe: DatePipe,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit() {
    this.weatherSearchForm = this.formBuilder.group({
      location: ['']
    });

    this.setCurrentDateTime();
    if (isPlatformBrowser(this.platformId)) {
      this.getCurrentLocationWeather();
    }
  }

  setCurrentDateTime() {
    const now = new Date();
    this.currentDateTime = this.datePipe.transform(now, 'medium');
  }

  getCurrentLocationWeather() {
    if (isPlatformBrowser(this.platformId) && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.fetchWeatherDataByCoords(lat, lon);
        },
        (error) => {
          console.error('Error getting location: ', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  fetchWeatherDataByCoords(lat: number, lon: number) {
    this.isLoading = true; // Set loading state to true
    this.weatherService.getWeatherByCoords(lat, lon)
      .subscribe(
        data => {
          this.weatherData = data;
          this.errorMessage = null;
          this.calculateLocalTime(data.timezone);
          this.setWeatherIcon(data.weather[0].icon);
          this.lowTemperature = data.main.temp_min;
          this.highTemperature = data.main.temp_max;

          // Fetch forecast data
          this.weatherService.getForecastByCoords(lat, lon)
            .subscribe(
              forecast => {
                this.forecastData = forecast;
                this.hourlyForecast = this.getHourlyForecast(); // Prepare hourly forecast data
                this.isLoading = false; // Set loading state to false
              },
              error => {
                this.forecastData = null;
                this.hourlyForecast = [];
                this.isLoading = false; // Set loading state to false
              }
            );
        },
        error => {
          this.weatherData = null;
          this.errorMessage = error;
          this.isLoading = false; // Set loading state to false
        }
      );
  }

  sendToOpenWeatherMapAPI(formValues: any): void {
    this.isLoading = true; // Set loading state to true
    this.weatherService.getWeather(formValues.location)
      .subscribe(
        data => {
          this.weatherData = data;
          this.errorMessage = null;
          this.calculateLocalTime(data.timezone);
          this.setWeatherIcon(data.weather[0].icon);
          this.lowTemperature = data.main.temp_min;
          this.highTemperature = data.main.temp_max;

          // Fetch forecast data
          this.weatherService.getForecast(formValues.location)
            .subscribe(
              forecast => {
                this.forecastData = forecast;
                this.hourlyForecast = this.getHourlyForecast(); // Prepare hourly forecast data
                this.isLoading = false; // Set loading state to false
              },
              error => {
                this.forecastData = null;
                this.hourlyForecast = [];
                this.isLoading = false; // Set loading state to false
              }
            );
        },
        error => {
          this.weatherData = null;
          this.errorMessage = error;
          this.isLoading = false; // Set loading state to false
        }
      );
  }

  calculateLocalTime(timezoneOffset: number) {
    if (timezoneOffset) {
      const localTime = moment().utcOffset(timezoneOffset / 60).format('ddd DD MMM YYYY hh:mm A');
      this.localTime = localTime;
    }
  }

  getHourlyForecast(): any[] {
    if (!this.forecastData || !this.forecastData.list) {
      return [];
    }

    const hourlyForecast: any[] = [];
    const now = moment();

    for (let i = 0; i < 24; i++) {
      const targetTime = now.clone().add(i, 'hours').startOf('hour');
      const forecast = this.forecastData.list.find((item: any) => {
        const forecastTime = moment.unix(item.dt);
        return forecastTime.isSame(targetTime, 'hour');
      });

      if (forecast) {
        hourlyForecast.push({
          time: targetTime.format('hh:mm A'),
          iconUrl: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`,
          temperature: forecast.main.temp
        });
      } else {
        hourlyForecast.push({
          time: targetTime.format('hh:mm A'),
          iconUrl: '',
          temperature: null
        });
      }
    }

    return hourlyForecast;
  }

  setWeatherIcon(icon: string) {
    this.iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
  }

  getDayName(day: number): string {
    return moment().add(day, 'days').format('dddd');
  }

  getWeekForecast(): number[] {
    return Array.from({ length: 6 }, (_, i) => i + 1); // Starts from the next day
  }

  getForecastForDay(day: number): any[] {
    if (!this.forecastData || !this.forecastData.list) {
      return [];
    }

    const startOfDay = moment().add(day, 'days').startOf('day').unix();
    const endOfDay = moment().add(day, 'days').endOf('day').unix();

    return this.forecastData.list.filter((forecast: any) => {
      const isWithinDay = forecast.dt >= startOfDay && forecast.dt <= endOfDay;
      if (isWithinDay) {
        // Set the icon URL for each forecast entry
        forecast.weather[0].iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
      }
      return isWithinDay;
    });
  }

  toggleTemperatureUnit() {
    this.isLoading = true; // Set loading state to true
    setTimeout(() => {
      this.isCelsius = !this.isCelsius;
      this.isLoading = false; // Set loading state to false after toggle
    }, 500); // Simulate a delay (e.g., for fetching data)
  }

  convertTemperature(temp: number): number {
    if (this.isCelsius) {
      return temp;
    } else {
      // Convert Celsius to Fahrenheit rounded to 2 decimal points
      return parseFloat(((temp * 9 / 5) + 32).toFixed(2));
    }
  }
  
}
