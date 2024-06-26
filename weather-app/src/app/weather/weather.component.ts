import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WeatherService } from '../weather.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css',
  providers: [WeatherService]
})

export class WeatherComponent implements OnInit {
  public weatherSearchForm!: FormGroup;
  weatherData: any;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.weatherSearchForm = this.formBuilder.group({
      location: ['']
    });
  }

  sendToOpenWeatherMapAPI(formValues: any): void{
    this.weatherService.getWeather(formValues.location)
      .subscribe(data => {
        this.weatherData = data;
        this.errorMessage = null;
      },
      error => {
        this.weatherData = null;
        this.errorMessage = error;
      }
    );
  }
}