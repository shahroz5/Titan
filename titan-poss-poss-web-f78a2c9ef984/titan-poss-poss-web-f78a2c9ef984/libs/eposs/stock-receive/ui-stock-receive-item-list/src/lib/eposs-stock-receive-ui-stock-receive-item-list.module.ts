import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockReceiveItemListComponent } from './item-list/stock-receive-item-list.component';
import { StockReceiveItemComponent } from './item/stock-receive-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { StockReceiveHistoryItemComponent } from './history-item/stock-receive-history-item.component';

@NgModule({
  declarations: [
    StockReceiveItemListComponent,
    StockReceiveItemComponent,
    StockReceiveHistoryItemComponent
  ],
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading the Shared Components
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFocusableListModule,
    SharedItemUiItemDetailsModule
  ],
  exports: [
    StockReceiveItemListComponent,
    StockReceiveItemComponent,
    StockReceiveHistoryItemComponent
  ]
})
export class EpossStockReceiveUiStockReceiveItemListModule {}
