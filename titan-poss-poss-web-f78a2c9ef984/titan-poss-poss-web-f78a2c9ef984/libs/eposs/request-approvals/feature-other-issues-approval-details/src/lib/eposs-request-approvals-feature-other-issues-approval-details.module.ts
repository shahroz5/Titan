import { EpossStockReceiveDataAccessStockReceiveModule } from '@poss-web/eposs/stock-receive/data-access-stock-receive';
import { EpossRequestApprovalsUiOtherIssueApprovalsItemListModule } from '@poss-web/eposs/request-approvals/ui-other-issue-approvals-item-list';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';

import { EpossRequestApprovalsDataAccessRequestApprovalsModule } from '@poss-web/eposs/request-approvals/data-access-request-approvals';
import { OtherIssuesApprovalsDetailComponent } from './other-issues-approvals-detail.component';

const routes: Routes = [
  {
    path: '',
    component: OtherIssuesApprovalsDetailComponent
  }
];

@NgModule({
  declarations: [OtherIssuesApprovalsDetailComponent],
  imports: [
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedItemUiItemSearchModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFilterDialogModule,

    //loading the app specific shared components

    EpossRequestApprovalsDataAccessRequestApprovalsModule,
    EpossStockReceiveDataAccessStockReceiveModule,
    EpossRequestApprovalsUiOtherIssueApprovalsItemListModule
  ]
})
export class EpossRequestApprovalsFeatureOtherIssuesApprovalDetailsModule {}
