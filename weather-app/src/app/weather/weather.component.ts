import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WeatherService } from '../weather.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import moment from 'moment-timezone';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    NgbModule,
    NavbarComponent,
  ],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  providers: [WeatherService, DatePipe]
})

export class WeatherComponent implements OnInit {
  public weatherSearchForm!: FormGroup;
  public favoriteLocationForm!: FormGroup;
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

    this.favoriteLocationForm = this.formBuilder.group({
      location: ['']
    });
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
          this.sendWeatherDataToBackend(data);
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
                this.hourlyForecast = this.getHourlyForecast(); // hourly forecast data
                this.isLoading = false; // Set loading state to false
              },
              error => {
                this.forecastData = null;
                this.hourlyForecast = [];
                this.isLoading = false; 
              }
            );
        },
        error => {
          this.weatherData = null;
          this.errorMessage = error;
          this.isLoading = false; 
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
        this.humidity = data.main.humidity;        
        this.windSpeed = data.wind.speed;

        // Send data to backend and history weather table
        const weatherData = {
          id: data.id,
          location: data.name,
          temperature: data.main.temp,
          description: data.weather[0].description,
          local_time: this.localTime,
          weather_icon: data.weather[0].icon,
          low_temperature: data.main.temp_min,
          high_temperature: data.main.temp_max,
          recorded_at: new Date().toISOString(),
          humidity: data.main.humidity,          
          wind_speed: data.wind.speed  
        };

        this.weatherService.addBackendWeatherData(weatherData).subscribe();
        this.weatherService.addHistory(weatherData).subscribe();

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
      const localTime = moment().utcOffset(timezoneOffset / 60).format('ddd DD MMM YYYY h:mm A');
      this.localTime = localTime;
    }
  }

  getHourlyForecast(): any[] {
    if (!this.forecastData || !this.forecastData.list) {
      return [];
    }
  
    const hourlyForecast: any[] = [];
    const startHour = 0; // 12:00 AM
    const endHour = 21; // 9:00 PM
  
    // OpenWeatherMap forecast data in 3-hour intervals
    this.forecastData.list.forEach((item: any) => {
      const forecastTime = moment.unix(item.dt);
      const hour = forecastTime.hour();
      if (hour >= startHour && hour <= endHour && (hour % 3 === 0)) {
        hourlyForecast.push({
          time: forecastTime.format('h:mm A'),
          iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
          temperature: item.main.temp
        });
      }
    });
  
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
        // Icon URL for each forecast entry
        forecast.weather[0].iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
      }
      return isWithinDay;
    });
  }

  toggleTemperatureUnit() {
    this.isLoading = true; 
    setTimeout(() => {
      this.isCelsius = !this.isCelsius;
      this.isLoading = false;
    }, 1000);
  }

  convertTemperature(temp: number): number {
    if (this.isCelsius) {
      return temp;
    } else {
      // Convert Celsius to Fahrenheit rounded to 2 decimal points
      return parseFloat(((temp * 9 / 5) + 32).toFixed(2));
    }
  }

  // Method to send weather data to backend
  sendWeatherDataToBackend(data: any) {
    const weatherData = {
      location: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      weather_icon: data.weather[0].icon, 
      low_temperature: data.main.temp_min,
      high_temperature: data.main.temp_max,
      timezone: data.timezone,
      local_time: this.localTime || new Date().toISOString(),
      humidity: data.main.humidity, 
      wind_speed: data.wind.speed  
    };

    this.weatherService.addBackendWeatherData(weatherData)
      .subscribe(
        response => {
          console.log('Weather data stored successfully', response);
        },
        error => {
          console.error('Error storing weather data', error);
        }
      );
  }
  
  fetchWeatherData(location: string) {
    this.weatherService.getWeather(location)
      .subscribe(
        data => {
          this.weatherData = data;
          this.sendWeatherDataToBackend(data);
        },
        error => {
          this.errorMessage = error.message;
          console.error('Error fetching weather data', error);
        }
      );
  }

  addFavorite() {
    const location = this.weatherSearchForm.get('location')?.value;
    if (location) {
      this.weatherService.addFavorites(location).subscribe(
        response => {
          this.notification = 'Favorite location added successfully!';
          setTimeout(() => {
            this.notification = '';
          }, 2000);
        },
        (error) => {
          console.error('Error saving favorite location:', error);
        }
      );
    }
  } 

  //getWeatherForecast(location: string): Observable<any> {
    //return this.http.get<any>(`${this.apiUrl}/forecast?location=${location}`);
  //}
}

