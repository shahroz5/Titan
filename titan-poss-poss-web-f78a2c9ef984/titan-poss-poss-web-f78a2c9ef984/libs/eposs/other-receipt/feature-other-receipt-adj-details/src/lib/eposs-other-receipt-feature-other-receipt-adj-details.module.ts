import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AdjustmentReceiptsDetailsComponent } from './adjustment-receipts-details.component';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { EpossOtherReceiptDataAccessOtherReceiptModule } from '@poss-web/eposs/other-receipt/data-access-other-receipt';
import { EpossOtherReceiptUiOtherReceiptAdjustmentItemListModule } from '@poss-web/eposs/other-receipt/ui-other-receipt-adjustment-item-list';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

const routes: Routes = [
  {
    path: '',
    component: AdjustmentReceiptsDetailsComponent
  }
];
@NgModule({
  declarations: [AdjustmentReceiptsDetailsComponent],
  imports: [
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,

    //loading standard route module from angular
    RouterModule.forChild(routes),

    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedItemUiItemSearchModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFilterDialogModule,
    SharedComponentsUiSelectionDialogModule,

    EpossOtherReceiptUiOtherReceiptAdjustmentItemListModule,
    EpossOtherReceiptDataAccessOtherReceiptModule,
    SharedUtilFieldValidatorsModule
  ]
})
export class EpossOtherReceiptFeatureOtherReceiptAdjDetailsModule {}
