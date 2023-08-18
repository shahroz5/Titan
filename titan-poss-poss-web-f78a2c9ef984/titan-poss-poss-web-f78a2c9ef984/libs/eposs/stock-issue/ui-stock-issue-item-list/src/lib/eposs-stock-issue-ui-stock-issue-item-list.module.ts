import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { StockIssueItemListComponent } from './item-list/stock-issue-item-list.component';
import { StockIssueItemComponent } from './item/stock-issue-item.component';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { HistoryItemComponent } from './history-item/history-item.component';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
@NgModule({
  declarations: [
    StockIssueItemComponent,
    StockIssueItemListComponent,
    HistoryItemComponent
  ],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFocusableListModule,
    SharedItemUiItemDetailsModule
  ],
  exports: [StockIssueItemComponent, StockIssueItemListComponent]
})
export class EpossStockIssueUiStockIssueItemListModule {}
