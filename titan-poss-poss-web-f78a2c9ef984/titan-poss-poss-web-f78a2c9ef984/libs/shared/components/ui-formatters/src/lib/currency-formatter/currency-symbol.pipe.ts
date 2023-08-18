import { Pipe, PipeTransform } from '@angular/core';
import { CurrencySymbolService } from './currency-symbol.service';

@Pipe({
  name: 'currencySymbol'
})
export class CurrencySymbolPipe implements PipeTransform {
  constructor(private currencySymbolService: CurrencySymbolService) {}

  transform(currencyCode: any, format: 'wide' | 'narrow' = 'wide'): any {
    return this.currencySymbolService.get(currencyCode, format);
  }
}
