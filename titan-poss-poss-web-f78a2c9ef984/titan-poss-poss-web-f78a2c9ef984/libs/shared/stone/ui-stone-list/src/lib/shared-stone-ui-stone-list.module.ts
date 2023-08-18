import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoneListingItemComponent } from './stone-listing-item/stone-listing-item.component';
import { StoneItemsComponent } from './stone-items/stone-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [StoneListingItemComponent, StoneItemsComponent],
  exports: [StoneListingItemComponent, StoneItemsComponent]
})
export class SharedStoneUiStoneListModule {}
