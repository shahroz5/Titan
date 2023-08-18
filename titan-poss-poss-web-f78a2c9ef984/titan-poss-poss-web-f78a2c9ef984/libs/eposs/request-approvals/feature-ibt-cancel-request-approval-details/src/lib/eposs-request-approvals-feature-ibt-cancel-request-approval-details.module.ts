import { EpossRequestApprovalsUiIbtCancelRequestItemListModule } from '@poss-web/eposs/request-approvals/ui-ibt-cancel-request-item-list';
import { NgModule } from '@angular/core';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { IbtCancellationRequestApprovalsDetailsComponent } from './ibt-cancellation-request-approvals-details.component';
import { EpossRequestApprovalsDataAccessRequestApprovalsModule } from '@poss-web/eposs/request-approvals/data-access-request-approvals';

const routes: Routes = [
  {
    path: '',
    component: IbtCancellationRequestApprovalsDetailsComponent
  }
];

@NgModule({
  declarations: [IbtCancellationRequestApprovalsDetailsComponent],
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
    SharedComponentsUiFormattersModule,

    //loading the app specific shared components

    EpossRequestApprovalsDataAccessRequestApprovalsModule,
    EpossRequestApprovalsUiIbtCancelRequestItemListModule
  ]
})
export class EpossRequestApprovalsFeatureIbtCancelRequestApprovalDetailsModule {}
