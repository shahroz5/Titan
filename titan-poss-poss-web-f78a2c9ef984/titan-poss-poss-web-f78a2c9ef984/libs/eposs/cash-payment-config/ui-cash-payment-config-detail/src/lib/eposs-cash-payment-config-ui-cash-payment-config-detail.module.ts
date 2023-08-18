import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { CashPaymentConfigurationDetailsComponent } from './cash-payment-configuration-details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [CashPaymentConfigurationDetailsComponent],
  exports: [CashPaymentConfigurationDetailsComponent]
})
export class EpossCashPaymentConfigUiCashPaymentConfigDetailModule {}
