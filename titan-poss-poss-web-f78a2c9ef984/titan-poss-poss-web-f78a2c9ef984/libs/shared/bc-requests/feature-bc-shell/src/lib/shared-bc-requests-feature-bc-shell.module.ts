import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedBcRequestsFeatureBcModule } from '@poss-web/shared/bc-requests/feature-bc';
import { BillCancellationRequestShellComponent } from './bill-cancellation-request-shell/bill-cancellation-request-shell.component';
const routes: Routes = [
  {
    path: '',
    component: BillCancellationRequestShellComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedCustomerFeatureCustomerSearchModule,
    SharedBcRequestsFeatureBcModule
  ],
  declarations: [BillCancellationRequestShellComponent],
  exports: [BillCancellationRequestShellComponent]
})
export class SharedBcRequestsFeatureBcShellModule {}
