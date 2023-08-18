import { NgModule } from '@angular/core';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { EpossOtherReceiptDataAccessOtherReceiptModule } from '@poss-web/eposs/other-receipt/data-access-other-receipt';
import { Routes, RouterModule } from '@angular/router';
import { PsvReceiptDetailsComponent } from './psv-receipt-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossOtherReceiptUiOtherReceiptPsvItemListModule } from '@poss-web/eposs/other-receipt/ui-other-receipt-psv-item-list';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

const routes: Routes = [
  {
    path: '',
    component: PsvReceiptDetailsComponent
  }
];
@NgModule({
  declarations: [PsvReceiptDetailsComponent],
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

    EpossOtherReceiptUiOtherReceiptPsvItemListModule,
    EpossOtherReceiptDataAccessOtherReceiptModule,
    SharedUtilFieldValidatorsModule
  ]
})
export class EpossOtherReceiptFeatureOtherReceiptPsvDetailsModule {}
