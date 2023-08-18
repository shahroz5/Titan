import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyViewComponent } from './view/currency-view/currency-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [CurrencyViewComponent],
  exports: [CurrencyViewComponent]
})
export class SharedCurrencyMasterUiCurrencyViewModule {}
