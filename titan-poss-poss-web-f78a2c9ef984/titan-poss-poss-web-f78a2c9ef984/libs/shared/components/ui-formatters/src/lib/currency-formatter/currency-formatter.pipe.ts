import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyFormatterService } from './currency-formatter.service';

@Pipe({
  name: 'currencyFormatter'
})
export class CurrencyFormatterPipe implements PipeTransform {
  constructor(private currencyFormatterService: CurrencyFormatterService) {}

  transform(
    value: any,
    currencyCode?: any,
    showSymbol = true,
    roundOff = false
  ): string {
    return this.currencyFormatterService.format(
      value,
      currencyCode,
      showSymbol,
      roundOff
    );
  }
}
