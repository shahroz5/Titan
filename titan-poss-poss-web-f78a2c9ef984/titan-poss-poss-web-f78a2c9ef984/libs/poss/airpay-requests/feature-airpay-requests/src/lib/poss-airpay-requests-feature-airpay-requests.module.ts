import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirpayPaymentRequestsComponent } from './airpay-payment-requests/airpay-payment-requests.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossAirpayRequestsDataAccessAirpayRequestsModule } from '@poss-web/poss/airpay-requests/data-access-airpay-requests';
import { PossAirpayRequestsUiAirpayRequestsListModule } from '@poss-web/poss/airpay-requests/ui-airpay-requests-list';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
const routes: Routes = [
  {
    path: '',
    component: AirpayPaymentRequestsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    PossAirpayRequestsDataAccessAirpayRequestsModule,
    PossAirpayRequestsUiAirpayRequestsListModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiLoaderModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [AirpayPaymentRequestsComponent]
})
export class PossAirpayRequestsFeatureAirpayRequestsModule {}
