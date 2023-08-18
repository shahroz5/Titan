import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedRoleConfigDataAccessRoleConfigModule } from '@poss-web/shared/role-config/data-access-role-config';
import { SharedRoleConfigUiRoleConfigListModule } from '@poss-web/shared/role-config/ui-role-config-list';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { CustomRoleConfigListingComponent } from './custom-role-config-listing/custom-role-config-listing.component';
import { RoleConfigListingComponent } from './role-config-listing/role-config-listing.component';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedRoleConfigDataAccessRoleConfigModule,
    SharedRoleConfigUiRoleConfigListModule,
    SharedComponentsUiSelectionDialogModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiFormFieldControlsModule,
    RouterModule.forChild([
      { path: 'customize', component: CustomRoleConfigListingComponent },
      { path: '**', component: RoleConfigListingComponent }
    ])
  ],
  declarations: [RoleConfigListingComponent, CustomRoleConfigListingComponent],
  exports: [CommonCustomMaterialModule]
})
export class SharedRoleConfigFeatureRoleConfigListingModule {}
