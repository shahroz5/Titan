import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentConfigurationDetailComponent } from './payment-configuration-detail/payment-configuration-detail.component';
import { SharedComponentsUiCheckboxGridModule } from '@poss-web/shared/components/ui-checkbox-grid';
import { EpossPaymentConfigurationDataAccessPaymentConfigurationModule } from '@poss-web/eposs/payment-configuration/data-access-payment-configuration';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossPaymentConfigurationUiPaymentConfigurationDetailModule } from '@poss-web/eposs/payment-configuration/ui-payment-configuration-detail';
import { EpossPaymentConfigurationUiPaymentConfigViewModule } from '@poss-web/eposs/payment-configuration/ui-payment-config-view';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
const route: Route[] = [
  { path: '', component: PaymentConfigurationDetailComponent }
];
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiCheckboxGridModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    EpossPaymentConfigurationDataAccessPaymentConfigurationModule,
    EpossPaymentConfigurationUiPaymentConfigurationDetailModule,
    EpossPaymentConfigurationUiPaymentConfigViewModule
  ],
  declarations: [PaymentConfigurationDetailComponent],
  providers: [SelectionDialogService]
})
export class EpossPaymentConfigurationFeaturePaymentConfigurationDetailModule {}
