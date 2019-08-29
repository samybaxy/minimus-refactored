import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UiService } from 'src/app/_services/ui/ui.service';
import { FbService } from 'src/app/_services/fb/fb.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'menu-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})
export class AsideComponent implements OnInit, OnDestroy {
  menuVisibility: boolean;
  darkModeStyle: boolean;
  userEmail: string = '';  
  private readonly onDestroy = new Subject<void>();

  constructor(
    private uiService: UiService,
    private fbService: FbService,
    private router: Router
  ) {
    this.initializeDarkmodeAndUserEmailSubscription();
  }

  ngOnInit() {
    this.setMenuVisibility();
  }

  setMenuVisibility() {
    this.uiService.menuVisibility
      .pipe(takeUntil(this.onDestroy))
      .subscribe(toggle => this.menuVisibility = toggle);
  }

  initializeDarkmodeAndUserEmailSubscription() {
    this.setDarkModeState();
    this.setUserEmail();
  }

  setDarkModeState() {
    this.uiService.darkModeState
      .pipe(takeUntil(this.onDestroy))
      .subscribe(value => this.darkModeStyle = value);
  }

  setUserEmail() {
    this.fbService.userData()
    .pipe(takeUntil(this.onDestroy))
    .subscribe(
      fireUser => this.userEmail = (fireUser) ? fireUser.email : ''
    );
  }

  toggleMenuVisibility() {
    this.menuVisibility = !this.menuVisibility;
    this.uiService.menuVisibility.next(this.menuVisibility);
  }

  logout($event: Event) {
    $event.stopImmediatePropagation();
    this.toggleMenuRedirectUserAndSignout();
  }

  toggleMenuRedirectUserAndSignout() {
    this.toggleMenuVisibility();
    this.fbService.signOut();
    this.uiService.isLoggedIn.next(false);
    this.router.navigateByUrl('/login');
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
