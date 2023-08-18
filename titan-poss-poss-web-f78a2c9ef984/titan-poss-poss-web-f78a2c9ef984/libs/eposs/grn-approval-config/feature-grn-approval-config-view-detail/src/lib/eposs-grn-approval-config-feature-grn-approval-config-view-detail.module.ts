import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnApprovalConfigViewDetailComponent } from './grn-approval-config-view-detail/grn-approval-config-view-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { EpossGrnApprovalConfigUiGrnApprovalConfigDetailModule } from '@poss-web/eposs/grn-approval-config/ui-grn-approval-config-detail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossGrnApprovalConfigDataAccessGrnApprovalConfigModule } from '@poss-web/eposs/grn-approval-config/data-access-grn-approval-config';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
const routes: Routes = [
  {
    path: '',
    component: GrnApprovalConfigViewDetailComponent
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
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [GrnApprovalConfigViewDetailComponent],
  providers: [SelectionDialogService]
})
export class EpossGrnApprovalConfigFeatureGrnApprovalConfigViewDetailModule {}
