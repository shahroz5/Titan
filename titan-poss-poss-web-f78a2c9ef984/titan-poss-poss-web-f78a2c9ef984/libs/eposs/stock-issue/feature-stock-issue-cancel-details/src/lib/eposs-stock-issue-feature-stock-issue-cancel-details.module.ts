import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockIssueCancelDetailsComponent } from './stock-issue-cancel-details/stock-issue-cancel-details.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { EpossStockIssueDataAccessStockIssueModule } from '@poss-web/eposs/stock-issue/data-access-stock-issue';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { EpossStockIssueUiStockIssueItemListModule } from '@poss-web/eposs/stock-issue/ui-stock-issue-item-list';
import {
  EpossSharedUiCourierDetailsPopupModule,
  CourierDetailsPopupComponent
} from '@poss-web/eposs/shared/ui-courier-details-popup';

import { EpossStockIssueTepGepDataAccessStockIssueTepGepModule } from '@poss-web/eposs/stock-issue-tep-gep/data-access-stock-issue-tep-gep';
import { EpossStockReturnDataAccessStockReturnModule } from '@poss-web/eposs/stock-return/data-access-stock-return';

const routes: Routes = [
  {
    path: '',
    component: StockIssueCancelDetailsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    SharedItemUiItemSearchModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFilterDialogModule,
    EpossStockIssueDataAccessStockIssueModule,
    SharedComponentsUiFormattersModule,
    EpossSharedUiCourierDetailsPopupModule,
    EpossStockIssueUiStockIssueItemListModule,
    EpossStockIssueTepGepDataAccessStockIssueTepGepModule,
    EpossStockReturnDataAccessStockReturnModule
  ],
  declarations: [StockIssueCancelDetailsComponent],
  entryComponents: [CourierDetailsPopupComponent]
})
export class EpossStockIssueFeatureStockIssueCancelDetailsModule {}
