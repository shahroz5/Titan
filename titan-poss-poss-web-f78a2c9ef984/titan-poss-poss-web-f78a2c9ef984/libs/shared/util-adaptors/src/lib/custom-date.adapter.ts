import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { POSS_WEB_DATE_FORMAT } from '@poss-web/shared/util-config';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CustomDateAdapter extends MomentDateAdapter {
  constructor(
    @Inject(LOCALE_ID) public readonly locale: string,
    @Inject(POSS_WEB_DATE_FORMAT) private dateFormat
  ) {
    super(locale);
  }

  // public parse(value: any): moment.Moment | null {
  //   if (value && typeof value === 'string') {
  //     const result = moment(value, this.dateFormat, this.locale, true);
  //     return result;
  //   }
  //   return value ? moment(value).locale(this.locale) : null;
  // }

  public parse(value: any): moment.Moment | null {
    return value ? moment(value) : null;
  }
  public format(date: moment.Moment, displayFormat: string): string {
    const locale = this.locale;
    const format = this.dateFormat;

    const result = date.locale(locale).format(format);

    // console.log(
    //   `Reading date [local: '${locale}'; format: '${format}'; result: '${result}']`
    // );

    return result;
  }
}
