import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FtepApprovalConfigViewDetailComponent } from './ftep-approval-config-view-detail/ftep-approval-config-view-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { EpossFtepApprovalConfigUiFtepApprovalConfigDetailModule } from '@poss-web/eposs/ftep-approval-config/ui-ftep-approval-config-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossFtepApprovalConfigDataAccessFtepApprovalConfigModule } from '@poss-web/eposs/ftep-approval-config/data-access-ftep-approval-config';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
const routes: Routes = [
  {
    path: '',
    component: FtepApprovalConfigViewDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    EpossFtepApprovalConfigUiFtepApprovalConfigDetailModule,
    RouterModule.forChild(routes),
    EpossFtepApprovalConfigDataAccessFtepApprovalConfigModule
  ],
  declarations: [FtepApprovalConfigViewDetailComponent]
})
export class EpossFtepApprovalConfigFeatureFtepApprovalConfigViewDetailModule {}
