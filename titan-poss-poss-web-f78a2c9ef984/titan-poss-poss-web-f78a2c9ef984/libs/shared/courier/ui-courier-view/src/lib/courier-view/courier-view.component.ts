import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { CountrySuccessPayload, CourierMaster } from '@poss-web/shared/models';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
@Component({
  selector: 'poss-web-courier-view',
  templateUrl: './courier-view.component.html'
})
export class CourierViewComponent implements OnInit, OnDestroy {
  @Input() courierDetails$: Observable<CourierMaster>;
  @Input() countryData$: Observable<CountrySuccessPayload[]>;
  @Output() isOpenLocationMapping = new EventEmitter<boolean>();
  destroy$ = new Subject();
  countryData: CountrySuccessPayload[] = [];



  ngOnInit(): void {
    combineLatest([this.countryData$])
      .pipe(takeUntil(this.destroy$), take(1))
      .subscribe(results => {
        this.countryData = results[0];
      });
    console.log('courierDetails', this.courierDetails$);
  }
  getCountryName(countryCode) {
    return this.countryData.filter(val => val.id === countryCode)[0].name;
  }
  openViewLocationMapping() {
    this.isOpenLocationMapping.emit(true);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
