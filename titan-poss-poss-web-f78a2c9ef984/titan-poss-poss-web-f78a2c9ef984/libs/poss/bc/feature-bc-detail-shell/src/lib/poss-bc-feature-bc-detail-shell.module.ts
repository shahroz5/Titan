import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcDetailShellComponent } from './bc-detail-shell/bc-detail-shell.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { PossBcFeatureBcDetailModule } from '@poss-web/poss/bc/feature-bc-detail';
import { RouterModule, Routes } from '@angular/router';
import { PossSharedOtherChargesFeatureOtherChargesModule } from '@poss-web/poss/shared/other-charges/feature-other-charges';


const routes: Routes = [
  {
    path: '',
    component: BcDetailShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedCustomerFeatureCustomerSearchModule,
    SharedPaymentFeaturePaymentModule,
    PossBcFeatureBcDetailModule,
    RouterModule.forChild(routes),
    PossSharedOtherChargesFeatureOtherChargesModule
  ],
  declarations: [BcDetailShellComponent],
  exports: [BcDetailShellComponent]
})
export class PossBcFeatureBcDetailShellModule {}
