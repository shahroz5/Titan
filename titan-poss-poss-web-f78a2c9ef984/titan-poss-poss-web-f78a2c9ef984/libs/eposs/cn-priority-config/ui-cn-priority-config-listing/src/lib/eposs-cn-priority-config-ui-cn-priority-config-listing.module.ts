import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnPriorityConfigItemsComponent } from './cn-priority-config-items/cn-priority-config-items.component';
import { CnPriorityConfigItemComponent } from './cn-priority-config-item/cn-priority-config-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { CnPriorityConfigSearchComponent } from './cn-priority-config-search/cn-priority-config-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [
    CnPriorityConfigItemsComponent,
    CnPriorityConfigItemComponent,
    CnPriorityConfigSearchComponent
  ],
  exports: [
    CnPriorityConfigItemsComponent,
    CnPriorityConfigItemComponent,
    CnPriorityConfigSearchComponent
  ]
})
export class EpossCnPriorityConfigUiCnPriorityConfigListingModule {}
