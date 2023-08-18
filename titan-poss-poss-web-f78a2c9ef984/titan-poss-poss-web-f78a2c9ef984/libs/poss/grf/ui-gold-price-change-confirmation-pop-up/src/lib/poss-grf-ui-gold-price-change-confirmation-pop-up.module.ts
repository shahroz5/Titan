import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { GoldPriceChangeConfirmationPopUpComponent } from './gold-price-change-confirmation-pop-up/gold-price-change-confirmation-pop-up.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [GoldPriceChangeConfirmationPopUpComponent],
  entryComponents: [GoldPriceChangeConfirmationPopUpComponent]
})
export class PossGrfUiGoldPriceChangeConfirmationPopUpModule {}
