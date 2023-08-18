import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentConfigurationDetailItemsComponent } from './payment-configuration-detail-items/payment-configuration-detail-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    CommonCustomMaterialModule
  ],
  declarations: [PaymentConfigurationDetailItemsComponent],
  exports: [PaymentConfigurationDetailItemsComponent]
})
export class EpossPaymentConfigurationUiPaymentConfigurationDetailModule {}
