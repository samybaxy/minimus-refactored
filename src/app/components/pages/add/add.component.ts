import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherService } from '../../../_services/weather/weather.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-addcity-page',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('5.5s ease-in')
      ])
    ])
  ]
})
export class AddComponent implements OnInit {
  favCityTemp: number;
  favCityName: string;
  countryOfFavCity: string;
  favCityWeatherCondition: string;
  
  capitalCities: string[] = [];
  capitalCityLength: number;
  selectedCity: string;
  cardCity: string;
  cityInvalidNote: boolean = false;
  countriesRestApi: string = 'https://restcountries.eu/rest/v2/all';
  randomImageFromUnsplash: string = 'https://source.unsplash.com/random/800x600';
  todaysDate: string;
  imageSplash: boolean = false;

  constructor(
    private http: HttpClient,
    private weather: WeatherService
  ) { }

  ngOnInit() {
    this.getCapitalCitiesAndDate();

    // image splash, corrects the quirk of flashing 2 pictures
    setTimeout(() => this.imageSplash = true, 2000);
  }

  getCapitalCitiesAndDate() {
    this.todaysDate = moment().format('dddd, MM MMMM');
    this.http.get(this.countriesRestApi)
      .pipe((take(1)))
      .subscribe(
        (countries: Array<any>) => {
          countries.forEach(country => (country.capital.length) && this.capitalCities.push(country.capital));
          this.capitalCities.sort();
          this.setCityOfTheDay();
          this.getWeatherConditions();
        }
      );
  }

  setCityOfTheDay() {
    const randomIndex = Math.floor(Math.random() * (this.capitalCities.length - 1));
    this.favCityName = this.capitalCities[randomIndex];
    this.randomImageFromUnsplash = `${this.randomImageFromUnsplash}?${this.favCityName}`;
  }

  getWeatherConditions() {
    this.weather.getWeather(this.favCityName)
      .subscribe({
        next: (payload: any) => this.storeCityWeatherConditions(payload),
        error: (err) => console.error(err)
      });
  }

  storeCityWeatherConditions(payload) {
    this.favCityWeatherCondition = payload.weather[0].main;
    this.favCityTemp = Math.ceil(Number(payload.main.temp));
    this.countryOfFavCity = payload.sys.country;
  }

  selectCity(city: any) {
    if (this.capitalCities.includes(city)) 
      this.setCardCityAndNote(city);
    else if (city.leading > 0) 
      this.cityInvalidNote = true;
  }

  setCardCityAndNote(city) {
    this.cardCity = city;
    this.cityInvalidNote = false;    
  }
}
