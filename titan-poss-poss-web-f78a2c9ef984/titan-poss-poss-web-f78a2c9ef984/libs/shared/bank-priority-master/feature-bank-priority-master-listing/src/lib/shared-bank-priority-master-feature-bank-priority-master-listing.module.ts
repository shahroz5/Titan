import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankPrioityListingComponent } from './bank-prioity-listing/bank-prioity-listing.component';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedBankPriorityMasterUiBankPriorityMasterListModule } from '@poss-web/shared/bank-priority-master/ui-bank-priority-master-list';
import { SharedBankPriorityMasterDataAccessBankPriorityMasterModule } from '@poss-web/shared/bank-priority-master/data-access-bank-priority-master';

const route = [
  { path: '', component: BankPrioityListingComponent, pathMatch: 'full' }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedBankPriorityMasterUiBankPriorityMasterListModule,
    SharedBankPriorityMasterDataAccessBankPriorityMasterModule
  ],
  declarations: [BankPrioityListingComponent]
})
export class SharedBankPriorityMasterFeatureBankPriorityMasterListingModule {}
