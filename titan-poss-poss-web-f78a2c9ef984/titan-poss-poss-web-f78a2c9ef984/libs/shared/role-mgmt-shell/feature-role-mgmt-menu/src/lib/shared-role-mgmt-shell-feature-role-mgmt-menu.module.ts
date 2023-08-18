import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedRoleConfigDataAccessRoleConfigModule } from '@poss-web/shared/role-config/data-access-role-config';
import { RoleManagementMenuComponent } from './role-management-menu.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedRoleConfigDataAccessRoleConfigModule,
    RouterModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [RoleManagementMenuComponent],
  exports: [RoleManagementMenuComponent]
})
export class SharedRoleMgmtShellFeatureRoleMgmtMenuModule {}
