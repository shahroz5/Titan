import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { EpossBinBinTransferUiBinBinTransferItemListModule } from '@poss-web/eposs/bin-bin-transfer/ui-bin-bin-transfer-item-list';
import { EpossBinBinTransferDataAccessBinBinTransferModule } from '@poss-web/eposs/bin-bin-transfer/data-access-bin-bin-transfer';
import { SharedComponentsUiExpansionPanelModule } from '@poss-web/shared/components/ui-expansion-panel';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';
import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { BinToBinTransferListComponent } from './bin-to-bin-transfer-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EpossBinBinTransferUiBinBinTransferPopupModule } from '@poss-web/eposs/bin-bin-transfer/ui-bin-bin-transfer-popup';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedComponentsUiSelectionDialogGridModule } from '@poss-web/shared/components/ui-selection-dialog-grid';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
const routes: Routes = [
  {
    path: '',
    component: BinToBinTransferListComponent
  }
];
@NgModule({
  declarations: [BinToBinTransferListComponent],
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiCardListModule,
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
    EpossBinBinTransferUiBinBinTransferPopupModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedLocationSettingsDataAccessLocationSettingsModule
  ]
})
export class EpossBinBinTransferFeatureBinBinTransferListModule {}
