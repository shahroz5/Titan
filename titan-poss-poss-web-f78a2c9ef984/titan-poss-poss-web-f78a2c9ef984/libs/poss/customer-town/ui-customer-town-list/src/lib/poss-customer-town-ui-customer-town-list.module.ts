import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTownListItemsComponent } from './customer-town-list-items/customer-town-list-items.component';
import { CustomerTownListingItemComponent } from './customer-town-listing-item/customer-town-listing-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    CustomerTownListItemsComponent,
    CustomerTownListingItemComponent
  ],
  exports: [CustomerTownListItemsComponent, CustomerTownListingItemComponent]
})
export class PossCustomerTownUiCustomerTownListModule {}
