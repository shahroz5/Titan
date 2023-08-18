import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMasterDetailComponent } from './payment-master-detail/payment-master-detail.component';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule, SharedComponentsUiDynamicFormModule, CommonCustomMaterialModule],
  declarations: [PaymentMasterDetailComponent],
  exports: [PaymentMasterDetailComponent],
  entryComponents: [PaymentMasterDetailComponent]
})
export class SharedPaymentMasterUiPaymentMasterDetailModule { }
