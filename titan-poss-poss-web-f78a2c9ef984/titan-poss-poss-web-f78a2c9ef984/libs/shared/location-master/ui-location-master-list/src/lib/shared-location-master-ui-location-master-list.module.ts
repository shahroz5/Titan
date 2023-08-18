import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

import { LocationListItemsComponent } from './location-list-items/location-list-items.component';
import { LocationListingItemComponent } from './location-listing-item/location-listing-item.component';
import { CopyDetailsDialogComponent } from './copy-details-dialog/copy-details-dialog.component';
import { LocationSearchComponent } from './location-search/location-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    LocationListingItemComponent,
    LocationListItemsComponent,
    CopyDetailsDialogComponent,
    LocationSearchComponent
  ],
  exports: [
    LocationListingItemComponent,
    LocationListItemsComponent,
    LocationSearchComponent
  ],
  entryComponents: [CopyDetailsDialogComponent]
})
export class SharedLocationMasterUiLocationMasterListModule {}
