import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { DateFormatterService } from './date-formatter.service';

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe implements PipeTransform {
  constructor(private dateFormatterService: DateFormatterService) {}

  transform(value: any): any {
    return this.dateFormatterService.format(value);
    // return this.dateFormatterService.format(moment(value).utcOffset(330));
  }
}
