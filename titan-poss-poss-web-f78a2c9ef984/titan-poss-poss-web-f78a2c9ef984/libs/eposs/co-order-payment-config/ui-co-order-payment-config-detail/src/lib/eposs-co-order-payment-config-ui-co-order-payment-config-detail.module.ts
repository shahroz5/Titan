import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoOrderPaymentPopupComponent } from './co-order-payment-popup/co-order-payment-popup.component';
import { CoOrderPaymentDetailsItemComponent } from './co-order-payment-details-item/co-order-payment-details-item.component';
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
  declarations: [
    CoOrderPaymentPopupComponent,
    CoOrderPaymentDetailsItemComponent
  ],
  exports: [CoOrderPaymentPopupComponent, CoOrderPaymentDetailsItemComponent]
})
export class EpossCoOrderPaymentConfigUiCoOrderPaymentConfigDetailModule {}
