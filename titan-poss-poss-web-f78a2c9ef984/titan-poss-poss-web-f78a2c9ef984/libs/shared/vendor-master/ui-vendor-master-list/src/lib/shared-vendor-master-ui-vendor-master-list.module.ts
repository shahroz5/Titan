import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorMasterListItemsComponent } from './vendor-master-list-items/vendor-master-list-items.component';
import { VendorMasterListItemComponent } from './vendor-master-list-item/vendor-master-list-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [VendorMasterListItemsComponent, VendorMasterListItemComponent],
  exports: [VendorMasterListItemsComponent, VendorMasterListItemComponent]
})
export class SharedVendorMasterUiVendorMasterListModule {}
