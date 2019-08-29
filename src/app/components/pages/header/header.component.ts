import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/_services/ui/ui.service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isLoggedIn: boolean;
  @Output() toggleDarkModeStyle = new EventEmitter<boolean>();
  menuVisibility: boolean;
  darkModeStyle: boolean;
  private readonly onDestroy = new Subject<void>();

  constructor(
    private uiService: UiService
  ) { }

  ngOnInit() {
    this.checkLoginAndDarkmode();

    //listen for menuToggle observable
    this.uiService.menuVisibility
      .pipe(takeUntil(this.onDestroy)).
      subscribe(toggle => this.menuVisibility = toggle )
  }

  checkLoginAndDarkmode() {
    this.checkLogin();
    this.uiService.darkModeState
      .pipe(take(1))
      .subscribe((value) => {
        this.darkModeStyle = value;
      });
  }

  checkLogin() {
    this.uiService.isLoggedIn
      .pipe(takeUntil(this.onDestroy))
      .subscribe((value) => this.isLoggedIn = value);
  }
  
  onToggleMenuVisibility() {
    this.updateAndemitVisibilityState();
  }

  updateAndemitVisibilityState() {
    this.menuVisibility = !this.menuVisibility;
    this.uiService.menuVisibility.next(this.menuVisibility);
  }

  onToggleDarkModeStyle() {
    this.updateAndemitDarkModeStyle();
  }

  updateAndemitDarkModeStyle() {
    this.darkModeStyle = !this.darkModeStyle;
    this.uiService.darkModeState.next(this.darkModeStyle);
    this.toggleDarkModeStyle.emit( this.darkModeStyle );
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}