import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { RazorpayConfigListComponent } from './razorpay-config-list.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [RazorpayConfigListComponent],
  exports: [RazorpayConfigListComponent]
})
export class EpossRazorpayHostnameConfigUiRazorpayHostnameConfigListModule {}
