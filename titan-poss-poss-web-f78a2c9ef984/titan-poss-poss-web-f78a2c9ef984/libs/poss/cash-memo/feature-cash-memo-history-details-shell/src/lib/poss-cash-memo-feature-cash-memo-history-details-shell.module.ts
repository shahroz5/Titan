import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryDetailsShellComponent } from './history-details-shell/history-details-shell.component';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossCashMemoFeatureCashMemoHistoryDetailsModule } from '@poss-web/poss/cash-memo/feature-cash-memo-history-details';

import { RouterModule, Routes } from '@angular/router';
import { PossSharedOtherChargesFeatureOtherChargesModule } from '@poss-web/poss/shared/other-charges/feature-other-charges';

const routes: Routes = [
  {
    path: '',
    component: HistoryDetailsShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPaymentFeaturePaymentModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossCashMemoFeatureCashMemoHistoryDetailsModule,
    PossSharedOtherChargesFeatureOtherChargesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HistoryDetailsShellComponent]
})
export class PossCashMemoFeatureCashMemoHistoryDetailsShellModule {}
