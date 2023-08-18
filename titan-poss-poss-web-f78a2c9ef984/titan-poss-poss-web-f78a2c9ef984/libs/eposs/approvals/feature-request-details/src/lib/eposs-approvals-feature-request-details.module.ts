import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RequestDetailShellComponent } from './request-detail-shell.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedRoleConfigUiRequestDetailModule } from '@poss-web/shared/role-config/ui-request-detail';
import { SharedRoleConfigDataAccessRoleConfigModule } from '@poss-web/shared/role-config/data-access-role-config';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedRoleConfigUiRequestDetailModule,
    SharedRoleConfigDataAccessRoleConfigModule,
    RouterModule.forChild([
      { path: '', component: RequestDetailShellComponent }
    ])
  ],
  declarations: [RequestDetailShellComponent]
})
export class EpossApprovalsFeatureRequestDetailsModule {}
