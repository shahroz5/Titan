import { Injectable, Inject } from '@angular/core';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { getCurrencySymbol } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CurrencySymbolService {
  constructor(@Inject(POSS_WEB_CURRENCY_CODE) private defaultCode) {}

  get(currencyCode: any, format: 'wide' | 'narrow' = 'wide'): any {
    return getCurrencySymbol(
      currencyCode ? currencyCode : this.defaultCode,
      format
    );
  }
}
