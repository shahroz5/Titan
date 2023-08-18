import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayerBanksComponent } from './payer-banks/payer-banks.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [PayerBanksComponent],
  exports: [PayerBanksComponent]
})
export class SharedPayerBankUiPayerBankItemListModule {}
