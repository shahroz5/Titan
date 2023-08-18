import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedRoleMgmtDataAccessRoleMgmtModule } from '@poss-web/shared/role-mgmt/data-access-role-mgmt';
import { SharedRoleMgmtUiRoleCreateFormModule } from '@poss-web/shared/role-mgmt/ui-role-create-form';
import { SharedRoleMgmtUiRoleEditFormModule } from '@poss-web/shared/role-mgmt/ui-role-edit-form';
import { SharedRoleMgmtUiRoleViewFormModule } from '@poss-web/shared/role-mgmt/ui-role-view-form';
import { SharedRoleMgmtUiRoleListModule } from '@poss-web/shared/role-mgmt/ui-role-list';
import { RoleListingComponent } from './role-listing.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedRoleMgmtDataAccessRoleMgmtModule,
    SharedRoleMgmtUiRoleListModule,
    SharedRoleMgmtUiRoleEditFormModule,
    SharedRoleMgmtUiRoleViewFormModule,
    SharedRoleMgmtUiRoleCreateFormModule,
    SharedComponentsUiFilterDialogModule,
    RouterModule.forChild([{ path: '', component: RoleListingComponent }])
  ],
  declarations: [RoleListingComponent]
})
export class SharedRoleMgmtFeatureRoleListingModule {}
