import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PossWebInputDirective } from './poss-web-input.directive';
import { PossWebTextareaDirective } from './poss-web-textarea.directive';
import { PossWebWeightInputDirective } from './poss-web-weight-input.directive';
import { PossWebAmountInputDirective } from './poss-web-amount-input.directive';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ErrorInfoTooltipComponent } from './error-info-tooltip/error-info-tooltip.component';
import { SelectDropdownComponent } from './select-dropdown/select-dropdown.component';
import { FiscalYearComponent } from './fiscal-year/fiscal-year.component';
import { DigiGoldInputDirective } from './digi-gold/digi-gold-weight-input.directive';
import { RefreshDropdownComponent } from './refresh-dropdown/refresh-dropdown.component';
import { SearchDropdownComponent } from './search-dropdown/search-dropdown.component';
import { PossWebOnlyNumber } from './poss-web-only-number.directive';
@NgModule({
  declarations: [
    PossWebInputDirective,
    PossWebTextareaDirective,
    PossWebWeightInputDirective,
    DigiGoldInputDirective,
    PossWebAmountInputDirective,
    ErrorInfoTooltipComponent,
    SelectDropdownComponent,
    FiscalYearComponent,
    RefreshDropdownComponent,
    SearchDropdownComponent,
    PossWebOnlyNumber
  ],
  imports: [CommonModule, CommonCustomMaterialModule],
  exports: [
    PossWebInputDirective,
    PossWebTextareaDirective,
    PossWebWeightInputDirective,
    DigiGoldInputDirective,
    PossWebAmountInputDirective,
    ErrorInfoTooltipComponent,
    SelectDropdownComponent,
    FiscalYearComponent,
    RefreshDropdownComponent,
    SearchDropdownComponent,
    PossWebOnlyNumber
  ]
})
export class SharedComponentsUiFormFieldControlsModule {}
