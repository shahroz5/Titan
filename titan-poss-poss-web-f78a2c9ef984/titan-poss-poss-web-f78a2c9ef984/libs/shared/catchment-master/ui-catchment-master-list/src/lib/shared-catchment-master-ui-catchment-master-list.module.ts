import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatchmentListItemsComponent } from './catchment-list-items/catchment-list-items.component';
import { CatchmentListingItemComponent } from './catchment-listing-item/catchment-listing-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [CatchmentListItemsComponent, CatchmentListingItemComponent],
  exports: [CatchmentListItemsComponent, CatchmentListingItemComponent]
})
export class SharedCatchmentMasterUiCatchmentMasterListModule {}
