import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PaymentConfigurationItemsComponent } from './payment-configuration-items/payment-configuration-items.component';
import { PaymentConfigurationItemComponent } from './payment-configuration-item/payment-configuration-item.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    PaymentConfigurationItemsComponent,
    PaymentConfigurationItemComponent
  ],
  exports: [
    PaymentConfigurationItemsComponent,
    PaymentConfigurationItemComponent
  ]
})
export class EpossPaymentConfigurationUiPaymentConfigurationListingModule {}
