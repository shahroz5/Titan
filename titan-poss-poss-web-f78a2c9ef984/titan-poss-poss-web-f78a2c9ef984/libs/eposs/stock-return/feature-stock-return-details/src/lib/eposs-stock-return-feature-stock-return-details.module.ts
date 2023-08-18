import { NgModule } from '@angular/core';
import { StockReturnDetailsComponent } from './stock-return-details.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { EpossStockReturnUiStockReturnItemListModule } from '@poss-web/eposs/stock-return/ui-stock-return-item-list';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { EpossStockReturnDataAccessStockReturnModule } from '@poss-web/eposs/stock-return/data-access-stock-return';
import {
  CourierDetailsPopupComponent,
  EpossSharedUiCourierDetailsPopupModule
} from '@poss-web/eposs/shared/ui-courier-details-popup';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { PossCnTransferDataAccessCnTransferModule } from '@poss-web/poss/cn-transfer/data-access-cn-transfer';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

const routes: Routes = [
  {
    path: '',
    component: StockReturnDetailsComponent
  }
];
@NgModule({
  declarations: [StockReturnDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedItemUiItemSearchModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiSortDialogModule,
    SharedComponentsUiFilterDialogModule,
    EpossStockReturnDataAccessStockReturnModule,
    EpossStockReturnUiStockReturnItemListModule,
    EpossSharedUiCourierDetailsPopupModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    PossCnTransferDataAccessCnTransferModule,
    SharedComponentsUiSelectionDialogModule
  ],
  entryComponents: [CourierDetailsPopupComponent]
})
export class EpossStockReturnFeatureStockReturnDetailsModule {}
