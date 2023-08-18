import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RazorpayRequestsListComponent } from './razorpay-requests-list/razorpay-requests-list.component';
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
  declarations: [RazorpayRequestsListComponent],
  exports: [RazorpayRequestsListComponent]
})
export class PossRazorpayStatusCheckUiRazorpayRequestsListsModule {}
