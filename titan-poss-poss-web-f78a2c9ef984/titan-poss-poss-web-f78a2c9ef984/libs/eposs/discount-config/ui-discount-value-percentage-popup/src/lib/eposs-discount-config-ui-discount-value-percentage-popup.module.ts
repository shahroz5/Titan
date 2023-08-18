import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountValuePercentagePopupComponent } from './discount-value-percentage-popup/discount-value-percentage-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [DiscountValuePercentagePopupComponent],
  entryComponents: [DiscountValuePercentagePopupComponent]
})
export class EpossDiscountConfigUiDiscountValuePercentagePopupModule {}
