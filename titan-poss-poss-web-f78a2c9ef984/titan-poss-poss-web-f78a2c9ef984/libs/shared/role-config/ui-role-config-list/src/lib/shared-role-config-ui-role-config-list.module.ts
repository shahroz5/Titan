import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleConfigListComponent } from './role-config-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [RoleConfigListComponent],
  exports: [RoleConfigListComponent]
})
export class SharedRoleConfigUiRoleConfigListModule {}
