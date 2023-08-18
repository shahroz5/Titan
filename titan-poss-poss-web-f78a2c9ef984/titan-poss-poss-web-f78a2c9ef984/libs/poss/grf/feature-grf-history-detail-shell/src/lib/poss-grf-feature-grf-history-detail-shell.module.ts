import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrfHistoryDetailShellComponent } from './grf-history-detail-shell/grf-history-detail-shell.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossGrfFeatureGrfHistoryDetailModule } from '@poss-web/poss/grf/feature-grf-history-detail';
import { RouterModule, Routes } from '@angular/router';
import { PossSharedProductFeatureProductModule } from '@poss-web/poss/shared/product/feature-product';

const routes: Routes = [
  {
    path: '',
    component: GrfHistoryDetailShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPaymentFeaturePaymentModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossGrfFeatureGrfHistoryDetailModule,
    PossSharedProductFeatureProductModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GrfHistoryDetailShellComponent],
  exports: [GrfHistoryDetailShellComponent]
})
export class PossGrfFeatureGrfHistoryDetailShellModule {}
