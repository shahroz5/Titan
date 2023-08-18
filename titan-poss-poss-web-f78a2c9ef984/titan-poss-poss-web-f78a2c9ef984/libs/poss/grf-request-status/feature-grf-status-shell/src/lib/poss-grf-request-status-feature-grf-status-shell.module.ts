import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrfStatusShellComponent } from './grf-status-shell/grf-status-shell.component';
import { RouterModule, Route } from '@angular/router';
import { PossGrfRequestStatusFeatureGrfStatusDetailsModule } from '@poss-web/poss/grf-request-status/feature-grf-status-details';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';


@NgModule({
  imports: [CommonModule,
    RouterModule.forChild([{ path: '', component:GrfStatusShellComponent}]),
    PossGrfRequestStatusFeatureGrfStatusDetailsModule,
    SharedPaymentFeaturePaymentModule,
    SharedToolbarFeatureToolbarModule,
    SharedCustomerFeatureCustomerSearchModule,
    CommonCustomMaterialModule
  ],
  declarations: [GrfStatusShellComponent],
  exports: [GrfStatusShellComponent]
})
export class PossGrfRequestStatusFeatureGrfStatusShellModule {}
