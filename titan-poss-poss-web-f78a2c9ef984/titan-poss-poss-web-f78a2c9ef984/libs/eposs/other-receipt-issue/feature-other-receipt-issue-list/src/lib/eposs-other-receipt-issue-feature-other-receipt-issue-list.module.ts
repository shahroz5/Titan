import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule, Routes } from '@angular/router';
import { OtherReceiptsIssuesListComponent } from './other-receipts-issues-list.component';
import { EpossOtherReceiptDataAccessOtherReceiptModule } from '@poss-web/eposs/other-receipt/data-access-other-receipt';
import { EpossOtherIssueDataAccessOtherIssueModule } from '@poss-web/eposs/other-issue/data-access-other-issue';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { EpossOtherReceiptIssueUiOtherReceiptIssueHistoryItemListModule } from '@poss-web/eposs/other-receipt-issue/ui-other-receipt-issue-history-item-list';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
const routes: Routes = [
  {
    path: '',
    component: OtherReceiptsIssuesListComponent
  }
];
@NgModule({
  declarations: [OtherReceiptsIssuesListComponent],
  imports: [
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    CommonModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedComponentsUiFormattersModule,
    EpossOtherReceiptDataAccessOtherReceiptModule,
    EpossOtherIssueDataAccessOtherIssueModule,
    EpossOtherReceiptIssueUiOtherReceiptIssueHistoryItemListModule,
    SharedPermissionUiPermissionModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ]
})
export class EpossOtherReceiptIssueFeatureOtherReceiptIssueListModule {}
