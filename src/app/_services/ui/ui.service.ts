import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  darkModeState: BehaviorSubject<boolean>;
  isLoggedIn: BehaviorSubject<boolean>;
  menuVisibility: BehaviorSubject<boolean>;

  constructor() {
    this.darkModeState = new BehaviorSubject<boolean>(false);
    this.isLoggedIn = new BehaviorSubject<boolean>(false);
    this.menuVisibility = new BehaviorSubject<boolean>(false);
  }
}