import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryDetailShellComponent } from './history-detail-shell/history-detail-shell.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedBcRequestsFeatureBcStatusModule } from '@poss-web/shared/bc-requests/feature-bc-status';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { RouterModule, Routes } from '@angular/router';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossBcFeatureBcHistoryDetailsModule } from '@poss-web/poss/bc/feature-bc-history-details';
import { PossSharedOtherChargesFeatureOtherChargesModule } from '@poss-web/poss/shared/other-charges/feature-other-charges';



const routes: Routes = [
  {
    path: '',
    component: HistoryDetailShellComponent,
  }
];
@NgModule({
  imports: [CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedBcRequestsFeatureBcStatusModule,
    SharedToolbarFeatureToolbarModule,
    PossBcFeatureBcHistoryDetailsModule,
    SharedPaymentFeaturePaymentModule,
    SharedCustomerFeatureCustomerSearchModule,
    PossSharedOtherChargesFeatureOtherChargesModule
  ],
  declarations: [HistoryDetailShellComponent],
  exports: [HistoryDetailShellComponent]
})
export class PossBcFeatureBcHistoryDetailsShellModule {}
