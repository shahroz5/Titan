import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossPaymentConfigurationDataAccessPaymentConfigurationModule } from '@poss-web/eposs/payment-configuration/data-access-payment-configuration';
import { EpossPaymentConfigurationUiPaymentConfigurationListingModule } from '@poss-web/eposs/payment-configuration/ui-payment-configuration-listing';
import { PaymentConfigurationListComponent } from './payment-configuration-list/payment-configuration-list.component';
import { EpossResidualWeightConfigDataAccessResidualWeightConfigModule } from '@poss-web/eposs/residual-weight-config/data-access-residual-weight-config';
const route: Route[] = [
  { path: '', component: PaymentConfigurationListComponent }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossPaymentConfigurationDataAccessPaymentConfigurationModule,
    EpossPaymentConfigurationUiPaymentConfigurationListingModule,
    EpossResidualWeightConfigDataAccessResidualWeightConfigModule
  ],
  declarations: [PaymentConfigurationListComponent]
})
export class EpossPaymentConfigurationFeaturePaymentConfigurationListingModule {}
