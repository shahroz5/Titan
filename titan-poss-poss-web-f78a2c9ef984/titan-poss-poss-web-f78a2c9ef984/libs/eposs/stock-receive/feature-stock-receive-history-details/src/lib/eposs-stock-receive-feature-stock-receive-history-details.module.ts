import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { EpossStockReceiveDataAccessStockReceiveModule } from '@poss-web/eposs/stock-receive/data-access-stock-receive';
import { SharedComponentsUiExpansionPanelModule } from '@poss-web/shared/components/ui-expansion-panel';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { EpossStockReceiveUiStockReceiveItemListModule } from '@poss-web/eposs/stock-receive/ui-stock-receive-item-list';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { StockReceiveHistoryDetailsComponent } from './stock-receive-history-details/stock-receive-history-details.component';
const routes: Routes = [
  {
    path: '',
    component: StockReceiveHistoryDetailsComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedItemUiItemSearchModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFilterDialogModule,
    SharedComponentsUiExpansionPanelModule,
    SharedComponentsUiSelectionDialogModule,
    SharedComponentsUiFormattersModule,

    //loading the app specific shared components
    EpossStockReceiveUiStockReceiveItemListModule,
    EpossStockReceiveDataAccessStockReceiveModule
  ],
  declarations: [StockReceiveHistoryDetailsComponent]
})
export class EpossStockReceiveFeatureStockReceiveHistoryDetailsModule {}
