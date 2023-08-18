import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

import { TepProductGroupListItemsComponent } from './tep-product-group-list-items/tep-product-group-list-items.component';
import { TepProductGroupListingItemComponent } from './tep-product-group-listing-item/tep-product-group-listing-item.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    TepProductGroupListItemsComponent,
    TepProductGroupListingItemComponent
  ],
  exports: [
    TepProductGroupListItemsComponent,
    TepProductGroupListingItemComponent
  ]
})
export class EpossTepProductGroupUiTepProductGroupListModule {}
