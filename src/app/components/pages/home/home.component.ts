import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { FbService } from './../../../_services/fb/fb.service';
import { Observable } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollBottom', {static: false}) private scrollBottom: ElementRef;
  cities$: Observable<any[]>;

  constructor(
    private fbService: FbService
  ) { }

  ngOnInit() {
    this.getCitiesFromFireStoreService();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    window.scroll(0, this.scrollBottom.nativeElement.scrollHeight);
  }

  getCitiesFromFireStoreService() {
    this.cities$ = this.fbService.getAuthState()
      .pipe(
        take(1),
        switchMap(user => this.fbService.getCities(user.uid))
      );
  }

}
