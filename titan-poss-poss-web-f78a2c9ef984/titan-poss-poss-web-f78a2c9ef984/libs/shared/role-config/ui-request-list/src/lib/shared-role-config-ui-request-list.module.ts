import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestListComponent } from './request-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiCardListModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [RequestListComponent],
  exports: [RequestListComponent]
})
export class SharedRoleConfigUiRequestListModule {}
