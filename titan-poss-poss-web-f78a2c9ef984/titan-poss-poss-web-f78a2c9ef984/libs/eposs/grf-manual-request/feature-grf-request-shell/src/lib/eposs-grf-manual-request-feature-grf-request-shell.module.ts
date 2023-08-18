import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { GrfRequestShellComponent } from './grf-request-shell/grf-request-shell.component';
import { EpossGrfManualRequestFeatureGrfRequestDetailsModule } from '@poss-web/eposs/grf-manual-request/feature-grf-request-details';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
const routes: Route[] = [
  {
    path: '',
    component: GrfRequestShellComponent
  }
];
@NgModule({
  imports: [CommonModule,
    RouterModule.forChild(routes),
    EpossGrfManualRequestFeatureGrfRequestDetailsModule,
    SharedPaymentFeaturePaymentModule,
    SharedToolbarFeatureToolbarModule,
    SharedCustomerFeatureCustomerSearchModule,
    CommonCustomMaterialModule
  ],
  declarations: [GrfRequestShellComponent],
  exports: [GrfRequestShellComponent]
})
export class EpossGrfManualRequestFeatureGrfRequestShellModule {}
