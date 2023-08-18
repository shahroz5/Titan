import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedItemUiErrorItemListPopupModule } from '@poss-web/shared/item/ui-error-item-list-popup';
import { EpossStockIssueUiStockIssueItemListModule } from '@poss-web/eposs/stock-issue/ui-stock-issue-item-list';
import {
  EpossSharedUiCourierDetailsPopupModule,
  CourierDetailsPopupComponent
} from '@poss-web/eposs/shared/ui-courier-details-popup';
import {
  EpossSharedUiOutOfStockPopupModule,
  OutOfStockPopupComponent
} from '@poss-web/eposs/shared/ui-out-of-stock-popup';
import { EpossStockIssueDataAccessStockIssueModule } from '@poss-web/eposs/stock-issue/data-access-stock-issue';
import { StockIssueDetailsComponent } from './stock-issue-details.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

const routes: Routes = [
  {
    path: '',
    component: StockIssueDetailsComponent
  }
];

@NgModule({
  declarations: [StockIssueDetailsComponent],
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
    EpossStockIssueUiStockIssueItemListModule,
    EpossStockIssueDataAccessStockIssueModule,
    EpossSharedUiOutOfStockPopupModule,
    EpossSharedUiCourierDetailsPopupModule,
    SharedComponentsUiFormattersModule,
    SharedPermissionUiPermissionModule,
    SharedItemUiErrorItemListPopupModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  entryComponents: [OutOfStockPopupComponent, CourierDetailsPopupComponent]
})
export class EpossStockIssueFeatureStockIssueDetailsModule {}
