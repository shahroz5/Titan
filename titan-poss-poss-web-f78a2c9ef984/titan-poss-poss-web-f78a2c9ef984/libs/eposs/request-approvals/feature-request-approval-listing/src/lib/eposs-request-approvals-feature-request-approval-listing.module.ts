import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { EpossRequestApprovalsUiBinRequestItemListModule } from '@poss-web/eposs/request-approvals/ui-bin-request-item-list';
import { EpossRequestApprovalsDataAccessRequestApprovalsModule } from '@poss-web/eposs/request-approvals/data-access-request-approvals';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule, Routes } from '@angular/router';

import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { RequestApprovalsComponent } from './request-approvals.component';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

const routes: Routes = [
  {
    path: '',
    component: RequestApprovalsComponent
  }
];

@NgModule({
  declarations: [RequestApprovalsComponent],
  imports: [
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    SharedComponentsUiSelectionDialogModule,
    SharedComponentsUiCardListModule,
    EpossRequestApprovalsDataAccessRequestApprovalsModule,
    EpossRequestApprovalsUiBinRequestItemListModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedPermissionUiPermissionModule
  ]
})
export class EpossRequestApprovalsFeatureRequestApprovalListingModule {}
