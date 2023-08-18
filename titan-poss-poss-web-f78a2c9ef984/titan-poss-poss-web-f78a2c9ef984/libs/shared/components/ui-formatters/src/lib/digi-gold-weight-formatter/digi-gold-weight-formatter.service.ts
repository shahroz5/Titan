import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DigiGoldWeightFormatterService {
  fractionDigitsMultiply = 1;
  constructor() {
    for (let i = 1; i <= 4; i++) {
      this.fractionDigitsMultiply = this.fractionDigitsMultiply * 10;
    }
  }

  format = (value: any): string => {
    return Number(
      Math.round(
        (value && !isNaN(value) ? value : 0) * this.fractionDigitsMultiply
      ) / this.fractionDigitsMultiply
    ).toFixed(4);
  };
}
