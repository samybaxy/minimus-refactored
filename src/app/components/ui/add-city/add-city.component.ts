import { Component, OnInit, OnDestroy} from '@angular/core';
import { UiService } from '../../../_services/ui/ui.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'add-city-card',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  darkModeStyle: boolean;

  constructor( private uiService: UiService ) { }
  ngOnInit() {
    this.setDarkModeState();
  }

  setDarkModeState() {
    this.uiService.darkModeState
      .pipe(takeUntil(this.onDestroy))
      .subscribe(isDark => this.darkModeStyle = isDark );
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
