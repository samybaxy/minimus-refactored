import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { WeatherService } from '../../../_services/weather/weather.service';
import { UiService } from '../../../_services/ui/ui.service';
import { FbService } from '../../../_services/fb/fb.service';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'weather-card',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy {
  constructor(
    private weather: WeatherService,
    private route: Router,
    private uiService: UiService,
    private fbService: FbService
  ) { }

  @Input() set city(city: string) {
    this.setCityMetadata(city)
  }
  @Input() canAddCity: boolean;
  @Output() cityStored = new EventEmitter();

  citesWeather: Object;
  darkModeStyle: boolean;
  weatherCondition: string;
  currentTemp: number;
  maxTemp: number;
  minTemp: number;
  errorMessage: string;
  cityName: string;
  cityAdded = false;
  private readonly onDestroy = new Subject<void>();

  setCityMetadata(city: string) {
    this.cityName = city;
    combineLatest( this.weather.getWeather(city), this.weather.getForecast(city))
      .subscribe((payload) => {
        this.weatherCondition = payload[0].weather[0].main;
        this.currentTemp = Math.ceil(payload[0].main.temp);
        this.maxTemp = Math.round(payload[1][0].main.temp);
        this.minTemp = Math.round(payload[1][0].main.temp);

        for (const res of payload[1]) {
          if (new Date().toLocaleDateString('en-GB') === new Date(res.dt_txt).toLocaleDateString('en-GB')) {
            this.maxTemp = res.main.temp > this.maxTemp ? Math.round(res.main.temp) : this.maxTemp;
            this.minTemp = res.main.temp < this.minTemp ? Math.round(res.main.temp) : this.minTemp;
          }
        }
      },
      err => {
        this.errorMessage = err.error.message;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    );
  }

  ngOnInit() {
    this.setDarkModeStyle();
  }

  setDarkModeStyle() {
    this.uiService.darkModeState
      .pipe(takeUntil(this.onDestroy))
      .subscribe((isDark) => {
        this.darkModeStyle = isDark;
      });
  }

  cityWeatherForecastPage() {
    if (!this.canAddCity)
      this.route.navigateByUrl('/details/' + this.cityName);
  }

  removeCity($event: Event, cityName: string) {
    $event.stopImmediatePropagation();
    this.fbService.removeCity(cityName);
  }

  addCity() {
    this.fbService
      .addCity(this.cityName)
      .subscribe(
        () => this.updateAndEmitValues(),
        err => console.error("update&Emit", err));
  }

  updateAndEmitValues() {
    this.cityAdded = true;
    this.clearCurrentCityMetadata();
    this.emitSavedCityAndsetTimeout();
  }

  clearCurrentCityMetadata() {
    this.cityName = this.maxTemp = this.minTemp = null;
    this.weatherCondition = this.currentTemp = null;
  }

  emitSavedCityAndsetTimeout() {
    this.cityStored.emit();
    setTimeout(() => {
      this.cityAdded = false;
      this.route.navigateByUrl('')
    }, 3500);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
