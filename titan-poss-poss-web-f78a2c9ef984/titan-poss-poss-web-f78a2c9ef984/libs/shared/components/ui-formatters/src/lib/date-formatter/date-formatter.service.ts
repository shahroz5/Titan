import { Injectable, Inject } from '@angular/core';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';
import * as moment from 'moment';
import { Moment } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {
  constructor(@Inject(POSS_WEB_DATE_FORMAT) private dateFormat) {}

  format(value: any): any {
    if (value) {
      return (value as Moment).format(this.dateFormat);
    } else return '';
  }
}
