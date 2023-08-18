import { NgModule } from '@angular/core';
import { RegionListItemsComponent } from './region-list-items/region-list-items.component';
import { RegionListingItemComponent } from './region-listing-item/region-listing-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  declarations: [RegionListingItemComponent, RegionListItemsComponent],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiToggleButtonModule
  ],
  exports: [RegionListingItemComponent, RegionListItemsComponent]
})
export class SharedRegionUiRegionListModule {}
