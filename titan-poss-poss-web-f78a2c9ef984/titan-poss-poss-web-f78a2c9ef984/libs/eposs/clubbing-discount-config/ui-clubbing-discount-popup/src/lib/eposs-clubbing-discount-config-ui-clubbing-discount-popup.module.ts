import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubbingDiscountAddRulePopupComponent } from './clubbing-discount-add-rule-popup/clubbing-discount-add-rule-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [ClubbingDiscountAddRulePopupComponent],
  entryComponents: [ClubbingDiscountAddRulePopupComponent],
  exports: [ClubbingDiscountAddRulePopupComponent]
})
export class EpossClubbingDiscountConfigUiClubbingDiscountPopupModule {}
