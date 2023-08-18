import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { EpossCashPaymentConfigDataAccessCashPaymentConfigModule } from '@poss-web/eposs/cash-payment-config/data-access-cash-payment-config';
import { EpossCashPaymentConfigUiCashPaymentConfigDetailModule } from '@poss-web/eposs/cash-payment-config/ui-cash-payment-config-detail';
import { CashPaymentConfigurationFeatureComponent } from './cash-payment-configuration-feature.component';

const routes: Routes = [
  {
    path: '',
    component: CashPaymentConfigurationFeatureComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossCashPaymentConfigDataAccessCashPaymentConfigModule,
    EpossCashPaymentConfigUiCashPaymentConfigDetailModule
  ],
  declarations: [CashPaymentConfigurationFeatureComponent]
})
export class EpossCashPaymentConfigFeatureCashPaymentConfigDetailModule {}
