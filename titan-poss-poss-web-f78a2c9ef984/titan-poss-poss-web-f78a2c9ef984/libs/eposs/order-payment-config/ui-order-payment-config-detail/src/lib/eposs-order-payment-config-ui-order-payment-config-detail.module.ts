import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPaymentPopupComponent } from './order-payment-popup/order-payment-popup.component';
import { OrderPaymentDetailsItemComponent } from './order-payment-details-item/order-payment-details-item.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [OrderPaymentPopupComponent, OrderPaymentDetailsItemComponent],
  exports: [OrderPaymentPopupComponent, OrderPaymentDetailsItemComponent]
})
export class EpossOrderPaymentConfigUiOrderPaymentConfigDetailModule {}
