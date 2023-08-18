import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnApprovalConfigListingComponent } from './grn-approval-config-listing/grn-approval-config-listing.component';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossGrnApprovalConfigDataAccessGrnApprovalConfigModule } from '@poss-web/eposs/grn-approval-config/data-access-grn-approval-config';
import { EpossGrnApprovalConfigUiGrnApprovalConfigListingModule } from '@poss-web/eposs/grn-approval-config/ui-grn-approval-config-listing';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const route: Route[] = [
  { path: '', component: GrnApprovalConfigListingComponent }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossGrnApprovalConfigDataAccessGrnApprovalConfigModule,
    EpossGrnApprovalConfigUiGrnApprovalConfigListingModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [GrnApprovalConfigListingComponent]
})
export class EpossGrnApprovalConfigFeatureGrnApprovalConfigListingModule {}
