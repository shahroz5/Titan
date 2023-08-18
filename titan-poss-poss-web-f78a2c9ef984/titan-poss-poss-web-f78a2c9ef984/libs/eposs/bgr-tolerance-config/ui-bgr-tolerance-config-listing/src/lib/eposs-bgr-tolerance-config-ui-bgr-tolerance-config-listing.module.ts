import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgrToleranceConfigItemsListComponent } from './bgr-tolerance-config-items-list/bgr-tolerance-config-items-list.component';
import { BgrToleranceConfigItemComponent } from './bgr-tolerance-config-item/bgr-tolerance-config-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [
    BgrToleranceConfigItemsListComponent,
    BgrToleranceConfigItemComponent
  ],
  exports: [
    BgrToleranceConfigItemsListComponent,
    BgrToleranceConfigItemComponent
  ]
})
export class EpossBgrToleranceConfigUiBgrToleranceConfigListingModule {}
