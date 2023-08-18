import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedRoleMgmtShellFeatureRoleMgmtMenuModule } from '@poss-web/shared/role-mgmt-shell/feature-role-mgmt-menu';
import { RoleManagementShellComponent } from './role-management-shell.component';

const routes: Routes = [
  {
    path: '',
    component: RoleManagementShellComponent,
    children: [
      {
        path: 'roles',
        loadChildren: () =>
          import('@poss-web/shared/role-mgmt/feature-role-listing').then(
            m => m.SharedRoleMgmtFeatureRoleListingModule
          )
      },
      {
        path: 'role-limit',
        loadChildren: () =>
          import(
            '@poss-web/shared/role-config/feature-role-config-listing'
          ).then(m => m.SharedRoleConfigFeatureRoleConfigListingModule)
      },
      {
        path: 'role-limit-requests',
        loadChildren: () =>
          import('@poss-web/shared/role-config/feature-request-listing').then(
            m => m.SharedRoleConfigFeatureRequestListingModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedRoleMgmtShellFeatureRoleMgmtMenuModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoleManagementShellComponent]
})
export class SharedRoleMgmtShellFeatureShellRoleMgmtModule {}
