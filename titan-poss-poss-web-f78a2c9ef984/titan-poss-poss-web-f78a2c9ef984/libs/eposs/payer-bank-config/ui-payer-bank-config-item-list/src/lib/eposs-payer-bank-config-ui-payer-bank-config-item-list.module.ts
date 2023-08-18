import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { PayerBankConfigItemsComponent } from './items/payer-bank-config-items.component';
import { PayerBankConfigItemComponent } from './item/payer-bank-config-item.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [PayerBankConfigItemsComponent, PayerBankConfigItemComponent],
  exports: [PayerBankConfigItemsComponent, PayerBankConfigItemComponent]
})
export class EpossPayerBankConfigUiPayerBankConfigItemListModule {}
