import { Injectable, Inject } from '@angular/core';
import { POSS_WEB_CURRENCY_CODE } from '@poss-web/shared/util-config';
import { CurrencyPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CurrencyFormatterService {
  constructor(
    @Inject(POSS_WEB_CURRENCY_CODE) private defaultCurrencyCode,
    private currencyPipe: CurrencyPipe
  ) {}

  private roudOff(value: number) {
    const positiveValue = Math.abs(value);
    const decimalPart = (positiveValue - Math.floor(positiveValue)) * 100;
    if (value >= 0) {
      return Math.floor(decimalPart >= 51 ? value + 1 : value);
    } else {
      return Math.ceil(decimalPart >= 51 ? value - 1 : value);
    }
  }

  format = (
    value: any,
    currencyCode?: any,
    showSymbol = true,
    roundOff = false
  ): string => {
    return this.currencyPipe.transform(
      !roundOff ? value : this.roudOff(value && !isNaN(value) ? value : 0),
      currencyCode ? currencyCode : this.defaultCurrencyCode,
      showSymbol ? 'symbol' : '',
      roundOff ? '1.0-0' : '1.2-2'
    );
  };
}
