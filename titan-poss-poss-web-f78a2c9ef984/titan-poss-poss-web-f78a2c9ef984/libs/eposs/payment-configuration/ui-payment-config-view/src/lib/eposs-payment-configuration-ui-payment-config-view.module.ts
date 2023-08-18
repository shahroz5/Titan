import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentConfigViewComponent } from './payment-config-view/payment-config-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiCheckboxGridModule } from '@poss-web/shared/components/ui-checkbox-grid';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiCheckboxGridModule
  ],
  declarations: [PaymentConfigViewComponent],
  exports: [PaymentConfigViewComponent]
})
export class EpossPaymentConfigurationUiPaymentConfigViewModule {}
