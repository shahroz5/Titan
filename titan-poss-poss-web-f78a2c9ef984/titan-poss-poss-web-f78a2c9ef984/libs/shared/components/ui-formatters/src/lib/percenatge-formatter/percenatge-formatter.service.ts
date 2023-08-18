import { Injectable, Inject } from '@angular/core';
import { POSS_WEB_PERCENTAGE_FRACTION_DIGITS } from '@poss-web/shared/util-config';

@Injectable({
  providedIn: 'root'
})
export class PercentageFormatterService {
  fractionDigitsMultiply = 1;

  constructor(
    @Inject(POSS_WEB_PERCENTAGE_FRACTION_DIGITS) private fractionDigits
  ) {
    for (let i = 1; i <= fractionDigits; i++) {
      this.fractionDigitsMultiply = this.fractionDigitsMultiply * 10;
    }
  }
  format(value: any, showSymbol = true): any {
    let formattedValue = Number(
      Math.round(
        (value && !isNaN(value) ? value : 0) * this.fractionDigitsMultiply
      ) / this.fractionDigitsMultiply
    ).toFixed(this.fractionDigits);

    if (showSymbol) formattedValue += '%';

    return formattedValue;
  }
}
