import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { UserListItemComponent } from './user-list-item/user-list-item.component';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [UserListComponent, UserListItemComponent],
  exports: [UserListComponent]
})
export class SharedUserMgmtUiUserListModule {}
