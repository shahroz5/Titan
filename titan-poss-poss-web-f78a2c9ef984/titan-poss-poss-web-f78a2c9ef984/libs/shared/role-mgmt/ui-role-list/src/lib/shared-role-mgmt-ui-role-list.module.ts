import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedRoleMgmtUiRoleDetailModule } from '@poss-web/shared/role-mgmt/ui-role-detail';
import { RoleListComponent } from './role-list.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedRoleMgmtUiRoleDetailModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [RoleListComponent],
  exports: [RoleListComponent]
})
export class SharedRoleMgmtUiRoleListModule {}
