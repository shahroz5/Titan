import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';

import { BgrConfigItemsComponent } from './bgr-config-items/bgr-config-items.component';
import { BgrConfigListingItemComponent } from './bgr-config-listing-item/bgr-config-listing-item.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [BgrConfigItemsComponent, BgrConfigListingItemComponent],
  exports: [BgrConfigItemsComponent, BgrConfigListingItemComponent]
})
export class EpossBgrConfigUiBgrConfigListModule {}
