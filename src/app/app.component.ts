import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  darkModeStyle: boolean = false;

  toggleDarkModeStyle(event: boolean) {
    this.darkModeStyle = event;
  }
}
