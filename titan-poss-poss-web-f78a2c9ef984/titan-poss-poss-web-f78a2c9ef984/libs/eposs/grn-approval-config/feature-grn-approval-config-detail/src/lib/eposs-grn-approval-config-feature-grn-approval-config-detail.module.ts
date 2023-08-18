import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnApprovalConfigDetailComponent } from './grn-approval-config-detail/grn-approval-config-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { EpossGrnApprovalConfigUiGrnApprovalConfigDetailModule } from '@poss-web/eposs/grn-approval-config/ui-grn-approval-config-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossGrnApprovalConfigDataAccessGrnApprovalConfigModule } from '@poss-web/eposs/grn-approval-config/data-access-grn-approval-config';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: GrnApprovalConfigDetailComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    EpossGrnApprovalConfigUiGrnApprovalConfigDetailModule,
    RouterModule.forChild(routes),
    EpossGrnApprovalConfigDataAccessGrnApprovalConfigModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [GrnApprovalConfigDetailComponent]
})
export class EpossGrnApprovalConfigFeatureGrnApprovalConfigDetailModule {}
