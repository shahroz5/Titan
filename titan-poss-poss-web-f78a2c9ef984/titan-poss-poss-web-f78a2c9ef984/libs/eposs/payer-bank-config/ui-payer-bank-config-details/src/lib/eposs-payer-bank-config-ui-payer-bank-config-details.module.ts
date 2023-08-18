import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayerBankConfigDetailComponent } from './payer-bank-config-detail/payer-bank-config-detail.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AgGridModule } from 'ag-grid-angular';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    AgGridModule.withComponents([]),
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [PayerBankConfigDetailComponent],
  exports: [PayerBankConfigDetailComponent]
})
export class EpossPayerBankConfigUiPayerBankConfigDetailsModule {}
