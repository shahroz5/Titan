import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGiftCardsFeatureGiftCardsHistoryDetailsModule } from '@poss-web/poss/gift-cards/feature-gift-cards-history-details';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { GiftCardsHistoryDetailsShellComponent } from './gift-cards-history-details-shell/gift-cards-history-details-shell.component';

const routes: Routes = [
  {
    path: '',
    component: GiftCardsHistoryDetailsShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPaymentFeaturePaymentModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossGiftCardsFeatureGiftCardsHistoryDetailsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GiftCardsHistoryDetailsShellComponent]
})
export class PossGiftCardsFeatureGiftCardsHistoryDetailsShellModule {}
