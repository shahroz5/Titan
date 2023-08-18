import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

import { TepStoneConfigListItemsComponent } from './tep-stone-config-list-items/tep-stone-config-list-items.component';
import { TepStoneConfigListingItemComponent } from './tep-stone-config-listing-item/tep-stone-config-listing-item.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    TepStoneConfigListItemsComponent,
    TepStoneConfigListingItemComponent
  ],
  exports: [
    TepStoneConfigListItemsComponent,
    TepStoneConfigListingItemComponent
  ]
})
export class EpossTepStoneConfigUiTepStoneConfigListModule {}
