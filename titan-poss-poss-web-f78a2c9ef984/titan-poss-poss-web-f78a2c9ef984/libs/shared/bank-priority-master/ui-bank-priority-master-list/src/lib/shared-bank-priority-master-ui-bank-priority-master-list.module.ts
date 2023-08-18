import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankPrioityListingItemsComponent } from './bank-prioity-listing-items/bank-prioity-listing-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { BankPriorityListDirective } from './bank-priority-list.directive';
import { BankPriorityListItemsDirective } from './bank-priority-list-items.directive'
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFocusableListModule


  ],
  declarations: [BankPrioityListingItemsComponent, BankPriorityListDirective, BankPriorityListItemsDirective],
  exports: [BankPrioityListingItemsComponent]

})
export class SharedBankPriorityMasterUiBankPriorityMasterListModule { }
