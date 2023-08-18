import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourierDetailsListingItemsComponent } from './courier-details-listing-items/courier-details-listing-items.component';
import { CourierDetailsListingItemComponent } from './courier-details-listing-item/courier-details-listing-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
@NgModule({
  declarations: [
    CourierDetailsListingItemsComponent,
    CourierDetailsListingItemComponent
  ],
  exports: [
    CourierDetailsListingItemsComponent,
    CourierDetailsListingItemComponent
  ],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ]
})
export class SharedCourierUiCourierListModule {}
