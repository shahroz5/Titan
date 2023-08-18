import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoneTypeListingItemComponent } from './stone-type-listing-item/stone-type-listing-item.component';
import { StoneTypeItemsComponent } from './stone-type-items/stone-type-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [StoneTypeListingItemComponent, StoneTypeItemsComponent],
  exports: [StoneTypeListingItemComponent, StoneTypeItemsComponent]
})
export class SharedStoneTypeUiStoneTypeListModule {}
