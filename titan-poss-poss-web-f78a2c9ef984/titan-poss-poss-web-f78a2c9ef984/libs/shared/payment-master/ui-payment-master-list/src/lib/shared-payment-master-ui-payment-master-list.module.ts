import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PaymentMasterListItemComponent } from './payment-master-list-item/payment-master-list-item.component';
import { PaymentMasterListItemsComponent } from './payment-master-list-items/payment-master-list-items.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    PaymentMasterListItemComponent,
    PaymentMasterListItemsComponent
  ],
  exports: [PaymentMasterListItemComponent, PaymentMasterListItemsComponent]
})
export class SharedPaymentMasterUiPaymentMasterListModule {}
