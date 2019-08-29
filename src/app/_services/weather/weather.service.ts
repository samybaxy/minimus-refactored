import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly weatherApi: string   = 'https://api.openweathermap.org/data/2.5/weather?q=';
  private readonly forecastApi: string  = 'https://api.openweathermap.org/data/2.5/forecast?q=';
  private readonly appID: string        = environment.appID;

  constructor( private http: HttpClient ) { }

  getWeather(city: string, metric: 'metric' | 'imperial' = 'metric'):Observable<any> {
    return this.http.get( `${this.weatherApi}${city}&units=${metric}&APPID=${this.appID}` )
    .pipe(first());
  };

  getForecast(city: string, metric: 'metric' | 'imperial' = 'metric'):Observable<any> {
    return this.http.get(
      `${this.forecastApi}${city}&units=${metric}&APPID=${this.appID}`
    )
    .pipe(first(), map((weather) => weather['list']));
  };
}