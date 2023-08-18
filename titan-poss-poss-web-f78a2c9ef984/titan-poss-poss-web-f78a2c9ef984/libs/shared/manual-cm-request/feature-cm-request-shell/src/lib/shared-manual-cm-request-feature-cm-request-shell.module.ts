import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmRequestShellComponent } from './cm-request-shell/cm-request-shell.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedManualCmRequestFeatureCmRequestDetailsModule } from '@poss-web/shared/manual-cm-request/feature-cm-request-details';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossSharedOtherChargesFeatureOtherChargesModule } from '@poss-web/poss/shared/other-charges/feature-other-charges';


const routes: Routes = [
  {
    path: '',
    component: CmRequestShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedManualCmRequestFeatureCmRequestDetailsModule,
    SharedPaymentFeaturePaymentModule,
    SharedToolbarFeatureToolbarModule,
    SharedCustomerFeatureCustomerSearchModule,
    CommonCustomMaterialModule,
    PossSharedOtherChargesFeatureOtherChargesModule
  ],
  declarations: [CmRequestShellComponent]
})
export class SharedManualCmRequestFeatureCmRequestShellModule {}
