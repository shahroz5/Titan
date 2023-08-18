import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockReturnItemlistComponent } from './item-list/stock-return-itemlist.component';
import { StockReturnItemComponent } from './item/stock-return-item.component';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
@NgModule({
  declarations: [StockReturnItemlistComponent, StockReturnItemComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFocusableListModule,
    SharedItemUiItemDetailsModule
  ],
  exports: [StockReturnItemlistComponent, StockReturnItemComponent]
})
export class EpossStockReturnUiStockReturnItemListModule {}
