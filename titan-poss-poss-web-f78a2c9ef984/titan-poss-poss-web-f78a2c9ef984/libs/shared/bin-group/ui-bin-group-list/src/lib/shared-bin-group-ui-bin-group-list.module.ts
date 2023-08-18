import { NgModule } from '@angular/core';
import { BinGroupListingItemComponent } from './bin-group-listing-item/bin-group-listing-item.component';
import { BinGroupListItemsComponent } from './bin-group-list-items/bin-group-list-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';


@NgModule({
  declarations: [BinGroupListItemsComponent, BinGroupListingItemComponent],
  imports: [CommonCustomMaterialModule, SharedComponentsUiThumbnailModule],
  exports: [BinGroupListItemsComponent, BinGroupListingItemComponent]
})
export class SharedBinGroupUiBinGroupListModule { }
