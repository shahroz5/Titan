import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { RoleComponent } from './role.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [RoleComponent],
  exports: [RoleComponent]
})
export class SharedRoleMgmtUiRoleDetailModule {}
