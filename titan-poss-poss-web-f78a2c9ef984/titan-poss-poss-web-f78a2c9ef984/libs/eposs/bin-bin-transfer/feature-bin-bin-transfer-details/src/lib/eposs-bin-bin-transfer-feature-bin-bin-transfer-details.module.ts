import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossBinBinTransferUiBinBinTransferItemListModule } from '@poss-web/eposs/bin-bin-transfer/ui-bin-bin-transfer-item-list';
import { EpossBinBinTransferDataAccessBinBinTransferModule } from '@poss-web/eposs/bin-bin-transfer/data-access-bin-bin-transfer';
import { SharedComponentsUiSelectionDialogGridModule } from '@poss-web/shared/components/ui-selection-dialog-grid';
import { SharedComponentsUiExpansionPanelModule } from '@poss-web/shared/components/ui-expansion-panel';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinToBinTransferDetailsComponent } from './bin-to-bin-transfer-details.component';
import { Routes, RouterModule } from '@angular/router';
import { HistoryDetailsComponent } from './bin-to-bin-transfer-history-details/history-details.component';
import { EpossBinBinTransferUiBinBinTransferPopupModule } from '@poss-web/eposs/bin-bin-transfer/ui-bin-bin-transfer-popup';
const routes: Routes = [
  {
    path: 'history/:_value',
    component: HistoryDetailsComponent
  },
  {
    path: ':type/:_value',
    component: BinToBinTransferDetailsComponent
  }
];
@NgModule({
  declarations: [BinToBinTransferDetailsComponent, HistoryDetailsComponent],
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedComponentsUiLoaderModule,
    SharedItemUiItemSearchModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFilterDialogModule,
    SharedComponentsUiExpansionPanelModule,
    SharedComponentsUiSelectionDialogGridModule,
    SharedComponentsUiFormattersModule,
    EpossBinBinTransferDataAccessBinBinTransferModule,
    EpossBinBinTransferUiBinBinTransferItemListModule,
    EpossBinBinTransferUiBinBinTransferPopupModule
  ]
})
export class EpossBinBinTransferFeatureBinBinTransferDetailsModule {}
