import { Component, OnInit, AfterViewChecked, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../../../_services/weather/weather.service';
import { forkJoin, Observable, Subject } from 'rxjs';
import { UiService } from '../../../_services/ui/ui.service';
import { concatMap, take, takeUntil } from 'rxjs/operators';
import { TwitterService } from '../../../_services/twitter/twitter.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollRef', {static: false}) private scrollRef: ElementRef;
  private readonly onDestroy = new Subject<void>();
  darkMode: boolean;
  city: string;
  state: string;
  temp: number;
  hum: number;
  wind: number;
  today: string;
  daysForecast: any[];
  cityIllustrationPath: string;
  errorMessage: string;
  tweets$: Observable<any>;

  constructor(
    private twitter: TwitterService,
    private activeRouter: ActivatedRoute,
    private weather: WeatherService,
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.uiService.darkModeState
      .pipe(take(1))
      .subscribe((isDark) => {
      this.darkMode = isDark;
    });

    this.transformCityPath()
      .subscribe(
        payload  => this.payloadSubscription(payload), 
        err => {
          this.errorMessage = err.error.message;
          setTimeout(() => this.errorMessage = '', 2500);
      });

    this.tweets$ = this.twitter.fetchTweets(this.city);
  }

  payloadSubscription(payload) {
    this.state = payload[0].weather[0].main;
    this.temp = Math.ceil(Number(payload[0].main.temp));
    this.hum = payload[0].main.humidity;
    this.wind = Math.round(Math.round(payload[0].wind.speed));
    const dates = {};

    this.loopPayloadAndInitializeDates(payload[1], dates);
    Object.keys(dates).forEach(day => dates[day].temp = Math.round(dates[day].temp / dates[day].counter));
    delete dates[Object.keys(dates)[0]];

    const orderDates = [];
    const days = this.daysOfTheWeek();

    for (let day of days) {
      if (dates[day]) orderDates.push(dates[day]);
    }

    this.daysForecast = orderDates;
  
  }

  transformCityPath() {
    const todayNumberInWeek = new Date().getDay();
    const days = this.daysOfTheWeek();
    this.today = days[todayNumberInWeek];
    return this.activeRouter.paramMap
      .pipe(
        takeUntil(this.onDestroy),
        concatMap((route: any) => {
          this.city = route.params.city;
          switch (this.city.toLowerCase()) {
            case 'paris':
              this.cityIllustrationPath = '../../../../assets/cities/france.svg';
              break;
            case 'doha':
              this.cityIllustrationPath = '../../../../assets/cities/qatar.svg';
              break;
            case 'rabat':
              this.cityIllustrationPath = '../../../../assets/cities/rabat.svg';
              break;
            case 'tunis':
              this.cityIllustrationPath = '../../../../assets/cities/tunis.svg';
              break;
            case 'tokyo':
              this.cityIllustrationPath = '../../../../assets/cities/japan.svg';
              break;
            default:
              this.cityIllustrationPath = '../../../../assets/cities/default.svg';
          }

          return forkJoin(this.weather.getWeather(this.city), this.weather.getForecast(this.city));
        })
      )
  }

  loopPayloadAndInitializeDates(payload: any, dates) {
    for (const res of payload) {
      const date = new Date(res.dt_txt).toDateString().split(' ')[0];
      if (dates[date]) {
        dates[date].day = date;
        dates[date].counter += 1;
        dates[date].temp += res.main.temp;
      } else {
        dates[date] = {
          day: date,
          state: res.weather[0].main,
          temp: res.main.temp,
          counter: 1
        };
      }
    }
  }

  daysOfTheWeek() {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }

  ngAfterViewChecked() {
    this.scrollToTop();
  }

  scrollToTop() {
    window.scroll(0,101);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

}