import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { PossRazorpayStatusCheckUiRazorpayRequestsListsModule } from '@poss-web/poss/razorpay-status-check/ui-razorpay-requests-lists';
import { PossRazorpayStatusCheckDataAccessRazorpayStatusCheckModule } from '@poss-web/poss/razorpay-status-check/data-access-razorpay-status-check';
import { RazorpayPaymentRequestsComponent } from './razorpay-payment-requests/razorpay-payment-requests.component';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
const routes: Routes = [
  {
    path: '',
    component: RazorpayPaymentRequestsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    PossRazorpayStatusCheckUiRazorpayRequestsListsModule,
    PossRazorpayStatusCheckDataAccessRazorpayStatusCheckModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiLoaderModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [RazorpayPaymentRequestsComponent]
})
export class PossRazorpayStatusCheckFeatureRazorpayRequestsModule {}
