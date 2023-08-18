import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SubRegionListingItemComponent } from '../../../ui-sub-region-list/src/lib/sub-region-listing-item/sub-region-listing-item.component';
import { SubRegionListItemsComponent } from '../../../ui-sub-region-list/src/lib/sub-region-list-items/sub-region-list-items.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  declarations: [SubRegionListingItemComponent, SubRegionListItemsComponent],
  imports: [CommonCustomMaterialModule, SharedComponentsUiThumbnailModule,SharedComponentsUiToggleButtonModule],
  exports: [SubRegionListingItemComponent, SubRegionListItemsComponent]
})
export class SharedSubRegionUiSubRegionListModule {}
