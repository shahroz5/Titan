import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { DeductionPercentagePopupComponent } from './deduction-percentage-popup/deduction-percentage-popup.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [DeductionPercentagePopupComponent],
  entryComponents: [DeductionPercentagePopupComponent],
  exports: [DeductionPercentagePopupComponent]
})
export class EpossGepPurityConfigUiGepPurityConfigPopupModule {}
