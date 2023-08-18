import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvanceHistoryDetailShellComponent } from './advance-history-detail-shell/advance-history-detail-shell.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossCtAdvanceFeatureAdvanceHistoryDetailModule } from '@poss-web/poss/ct-advance/feature-advance-history-detail';
import { RouterModule, Routes } from '@angular/router';
import { PossSharedProductFeatureProductModule } from '@poss-web/poss/shared/product/feature-product';

const routes: Routes = [
  {
    path: '',
    component: AdvanceHistoryDetailShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPaymentFeaturePaymentModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossCtAdvanceFeatureAdvanceHistoryDetailModule,
    PossSharedProductFeatureProductModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdvanceHistoryDetailShellComponent],
  exports: [AdvanceHistoryDetailShellComponent]
})
export class PossCtAdvanceFeatureAdvanceHistoryDetailShellModule {}
