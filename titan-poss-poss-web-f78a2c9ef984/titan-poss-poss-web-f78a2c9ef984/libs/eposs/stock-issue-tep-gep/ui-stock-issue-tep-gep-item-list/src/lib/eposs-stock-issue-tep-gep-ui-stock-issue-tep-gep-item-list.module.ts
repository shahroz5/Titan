import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { StockIssueTepItemListComponent } from './item-list/stock-issue-tep-gep-item-list.component';
import { StockIssueTepItemComponent } from './item/stock-issue-tep-gep-item.component';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';

@NgModule({
  declarations: [StockIssueTepItemComponent, StockIssueTepItemListComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedItemUiItemDetailsModule,
    SharedComponentsUiFocusableListModule
  ],
  exports: [StockIssueTepItemComponent, StockIssueTepItemListComponent]
})
export class EpossStockIssueTepGepUiStockIssueTepGepItemListModule {}
