import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { GiftCardsCmPaymentDetailsComponent } from './gift-cards-cm-payment-details/gift-cards-cm-payment-details.component';

@NgModule({
  imports: [CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule],
  declarations: [GiftCardsCmPaymentDetailsComponent],
  exports: [GiftCardsCmPaymentDetailsComponent]
})
export class PossGiftCardsUiGiftCardsCmPaymentDetailsModule {}
