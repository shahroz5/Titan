import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FtepApprovalConfigListingComponent } from './ftep-approval-config-listing/ftep-approval-config-listing.component';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossFtepApprovalConfigDataAccessFtepApprovalConfigModule } from '@poss-web/eposs/ftep-approval-config/data-access-ftep-approval-config';
import { EpossFtepApprovalConfigUiFtepApprovalConfigListingModule } from '@poss-web/eposs/ftep-approval-config/ui-ftep-approval-config-listing';

const route: Route[] = [
  { path: '', component: FtepApprovalConfigListingComponent }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossFtepApprovalConfigDataAccessFtepApprovalConfigModule,
    EpossFtepApprovalConfigUiFtepApprovalConfigListingModule
  ],
  declarations: [FtepApprovalConfigListingComponent]
})
export class EpossFtepApprovalConfigFeatureFtepApprovalConfigListingModule {}
