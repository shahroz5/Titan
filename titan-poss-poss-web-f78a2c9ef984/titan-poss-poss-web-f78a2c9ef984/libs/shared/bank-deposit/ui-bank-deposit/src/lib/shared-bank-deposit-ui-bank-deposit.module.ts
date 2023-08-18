import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDepositListComponent } from './bank-deposit-list/bank-deposit-list.component';
import { BankDepositFilterComponent } from './bank-deposit-filter/bank-deposit-filter.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AgGridModule } from 'ag-grid-angular';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    AgGridModule,
    SharedComponentsUiAgGridModule
  ],
  exports: [BankDepositListComponent, BankDepositFilterComponent],
  declarations: [BankDepositListComponent, BankDepositFilterComponent]
})
export class SharedBankDepositUiBankDepositModule {}
