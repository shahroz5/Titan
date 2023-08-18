import { Pipe, PipeTransform } from '@angular/core';
import { PercentageFormatterService } from './percenatge-formatter.service';

@Pipe({
  name: 'percentageFormatter'
})
export class PercentageFormatterPipe implements PipeTransform {
  constructor(private percentageFormatterService: PercentageFormatterService) {}

  transform(value: any, showSymbol = true): any {
    return this.percentageFormatterService.format(value, showSymbol);
  }
}
