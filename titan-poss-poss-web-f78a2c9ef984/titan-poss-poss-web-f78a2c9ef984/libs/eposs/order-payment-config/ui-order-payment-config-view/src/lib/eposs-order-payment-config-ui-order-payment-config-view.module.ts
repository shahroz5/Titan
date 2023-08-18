import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPaymentConfigViewComponent } from './order-payment-config-view/order-payment-config-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [OrderPaymentConfigViewComponent],
  exports: [OrderPaymentConfigViewComponent]
})
export class EpossOrderPaymentConfigUiOrderPaymentConfigViewModule {}
