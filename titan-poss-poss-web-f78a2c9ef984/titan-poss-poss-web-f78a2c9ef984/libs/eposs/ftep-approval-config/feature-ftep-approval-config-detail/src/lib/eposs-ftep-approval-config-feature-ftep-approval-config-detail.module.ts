import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FtepApprovalConfigDetailComponent } from './ftep-approval-config-detail/ftep-approval-config-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { EpossFtepApprovalConfigUiFtepApprovalConfigDetailModule } from '@poss-web/eposs/ftep-approval-config/ui-ftep-approval-config-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossFtepApprovalConfigDataAccessFtepApprovalConfigModule } from '@poss-web/eposs/ftep-approval-config/data-access-ftep-approval-config';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossFtepApprovalConfigUiFtepApprovalConfigViewModule } from '@poss-web/eposs/ftep-approval-config/ui-ftep-approval-config-view';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
const routes: Routes = [
  {
    path: '',
    component: FtepApprovalConfigDetailComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    EpossFtepApprovalConfigUiFtepApprovalConfigDetailModule,
    RouterModule.forChild(routes),
    EpossFtepApprovalConfigDataAccessFtepApprovalConfigModule,
    EpossFtepApprovalConfigUiFtepApprovalConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [FtepApprovalConfigDetailComponent],
  providers: [SelectionDialogService]
})
export class EpossFtepApprovalConfigFeatureFtepApprovalConfigDetailModule {}
