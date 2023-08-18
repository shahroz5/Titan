import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { StateListingItemComponent } from './state-listing-item/state-listing-item.component';
import { StateListItemsComponent } from './state-list-items/state-list-items.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  declarations: [StateListingItemComponent, StateListItemsComponent],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiToggleButtonModule
  ],
  exports: [StateListingItemComponent, StateListItemsComponent]
})
export class SharedStateUiStateListModule {}
