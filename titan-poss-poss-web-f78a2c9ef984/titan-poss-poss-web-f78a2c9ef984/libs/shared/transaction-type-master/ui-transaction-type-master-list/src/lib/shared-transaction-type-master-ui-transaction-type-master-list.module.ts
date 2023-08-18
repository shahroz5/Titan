import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';

import { TransactionTypeMasterItemsComponent } from './transaction-type-master-items/transaction-type-master-items.component';
import { TransactionTypeMasterListingItemComponent } from './transaction-type-master-listing-item/transaction-type-master-listing-item.component';
import { TransactionTypeSearchComponent } from './transaction-type-search/transaction-type-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [
    TransactionTypeMasterItemsComponent,
    TransactionTypeMasterListingItemComponent,
    TransactionTypeSearchComponent
  ],
  exports: [
    TransactionTypeMasterItemsComponent,
    TransactionTypeMasterListingItemComponent,
    TransactionTypeSearchComponent
  ]
})
export class SharedTransactionTypeMasterUiTransactionTypeMasterListModule {}
