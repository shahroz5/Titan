import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

import { RazorVendorListItemsComponent } from './razor-vendor-list-items.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [RazorVendorListItemsComponent],
  exports: [RazorVendorListItemsComponent]
})
export class EpossRazorpayVendorConfigUiRazorpayVendorConfigListModule {}
