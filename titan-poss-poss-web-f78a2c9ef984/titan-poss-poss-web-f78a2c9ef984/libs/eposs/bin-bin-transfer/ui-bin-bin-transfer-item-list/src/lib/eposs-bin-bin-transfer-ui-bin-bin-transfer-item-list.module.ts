import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinToBinTransferItemComponent } from './item/bin-to-bin-transfer-item.component';
import { BinToBinTransferItemListComponent } from './item-list/bin-to-bin-transfer-item-list.component';
import { HistoryItemComponent } from './bin-to-bin-transfer-history-item/history-item.component';
import { SharedComponentsUiSelectionDialogGridModule } from '@poss-web/shared/components/ui-selection-dialog-grid';

@NgModule({
  declarations: [
    BinToBinTransferItemComponent,
    BinToBinTransferItemListComponent,
    HistoryItemComponent
  ],
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading the Shared Components
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFocusableListModule,
    SharedItemUiItemDetailsModule,
    SharedComponentsUiSelectionDialogGridModule

  ],
  exports: [BinToBinTransferItemComponent, BinToBinTransferItemListComponent]
})
export class EpossBinBinTransferUiBinBinTransferItemListModule {}
