import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';

import { TransactionTypeMasterDetailsComponent } from './transaction-type-master-details.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [TransactionTypeMasterDetailsComponent],
  exports: [TransactionTypeMasterDetailsComponent],
  entryComponents: [TransactionTypeMasterDetailsComponent]
})
export class SharedTransactionTypeMasterUiTransactionTypeMasterDetailModule { }
