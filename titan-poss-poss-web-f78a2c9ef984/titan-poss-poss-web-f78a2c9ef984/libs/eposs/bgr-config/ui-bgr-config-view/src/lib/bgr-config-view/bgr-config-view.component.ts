import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BgrConfigDetails, OtherOptionTypes } from '@poss-web/shared/models';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-bgr-config-view',
  templateUrl: './bgr-config-view.component.html'
})
export class BgrConfigViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() configDetails: BgrConfigDetails;
  destroy$ = new Subject<null>();
  particularDay = '';
  bookingDay = '';
  currentDay = '';
  otherOptions = [];
  constructor(private translate: TranslateService) {
    this.translate
      .get([
        'pw.bgrConfigurations.configName',
        'pw.bgrConfigurations.particularDayGoldRate',
        'pw.bgrConfigurations.bookingDayGoldRate',
        'pw.bgrConfigurations.currentDayGoldRate'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.particularDay =
          translatedMsg['pw.bgrConfigurations.particularDayGoldRate'];
        this.bookingDay =
          translatedMsg['pw.bgrConfigurations.bookingDayGoldRate'];
        this.currentDay =
          translatedMsg['pw.bgrConfigurations.currentDayGoldRate'];
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configDetails']) {
      console.log('changes', this.configDetails);
    }
  }
  ngOnInit(): void {
    this.otherOptions = [
      {
        description: this.particularDay,
        value: OtherOptionTypes.PARTICULAR_DATE
      },
      {
        description: this.currentDay,
        value: OtherOptionTypes.CURRENT_DATE
      },
      {
        description: this.bookingDay,
        value: OtherOptionTypes.BOOKING_DATE
      }
    ];
    console.log('configDetails', this.configDetails);
  }
  getType(value) {
    console.log('value', value);
    let data;
    if (value) {
      data = this.otherOptions.filter(obj => obj.value === value);
    }
    if (data !== undefined) {
      return data[0].description;
    }
    console.log('descripton', data);
  }
  dateFormatting(date) {
    if (date) {
      return moment(date);
    } else {
      return '';
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
