import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { FocTransactionComponent } from './foc-transaction/foc-transaction.component';
import { PossFocFeatureIssuePendingFocModule } from '@poss-web/poss/foc/feature-issue-pending-foc';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';

const routes: Routes = [
  {
    path: '',
    component: FocTransactionComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    PossFocFeatureIssuePendingFocModule,
    SharedCustomerFeatureCustomerSearchModule,
    SharedToolbarFeatureToolbarModule
  ],
  declarations: [FocTransactionComponent],
  exports: [FocTransactionComponent]
})
export class PossFocFeatureFocShellModule {}
