import { NgModule } from '@angular/core';
import { CorporateTownListingItemComponent } from './corporate-town-listing-item/corporate-town-listing-item.component';
import { CorporateTownListItemsComponent } from './corporate-town-list-items/corporate-town-list-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  declarations: [
    CorporateTownListingItemComponent,
    CorporateTownListItemsComponent
  ],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiToggleButtonModule
  ],
  exports: [CorporateTownListingItemComponent, CorporateTownListItemsComponent]
})
export class SharedCorporateTownUiCorporateTownListModule {}
