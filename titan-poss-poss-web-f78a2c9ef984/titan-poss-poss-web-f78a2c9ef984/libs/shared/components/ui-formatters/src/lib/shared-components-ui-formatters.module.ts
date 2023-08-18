import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { WeightFormatterPipe } from './weight-formatter/weight-formatter.pipe';
import { DateFormatterPipe } from './date-formatter/date-formatter.pipe';
import { CurrencyFormatterPipe } from './currency-formatter/currency-formatter.pipe';
import { WeightInCaratPipe } from './weight-formatter/weight-in-carat.pipe';
import { CurrencySymbolPipe } from './currency-formatter/currency-symbol.pipe';
import { PercentageFormatterPipe } from './percenatge-formatter/percenatge-formatter.pipe';
import { DateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from '@poss-web/shared/util-adaptors';
import { ShortNumberPipe } from './short-number.pipe';
@NgModule({
  declarations: [
    WeightFormatterPipe,
    WeightInCaratPipe,
    DateFormatterPipe,
    CurrencyFormatterPipe,
    CurrencySymbolPipe,
    PercentageFormatterPipe,
    ShortNumberPipe
  ],
  imports: [CommonModule],
  exports: [
    WeightFormatterPipe,
    WeightInCaratPipe,
    CurrencyFormatterPipe,
    DateFormatterPipe,
    CurrencySymbolPipe,
    PercentageFormatterPipe,
    ShortNumberPipe
  ],
  providers: [
    CurrencyPipe,
    CustomDateAdapter, // so we could inject services to 'CustomDateAdapter'
    { provide: DateAdapter, useClass: CustomDateAdapter } // Parse MatDatePicker Format
  ]
})
export class SharedComponentsUiFormattersModule {}
