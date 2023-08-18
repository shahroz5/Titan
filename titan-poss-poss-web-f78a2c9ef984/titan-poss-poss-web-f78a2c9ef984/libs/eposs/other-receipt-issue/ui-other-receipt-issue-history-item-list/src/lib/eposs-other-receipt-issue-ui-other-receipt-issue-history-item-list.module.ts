import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from './item-list/item-list.component';
import { HistoryItemComponent } from './history-item/history-item.component';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { OtherReceiptsIssueHistoryAdvancedPopupComponent } from './other-receipts-issue-history-advanced-popup/other-receipts-issue-history-advanced-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormattersModule,
    SharedItemUiItemDetailsModule,
    SharedComponentsUiFocusableListModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [
    ItemListComponent,
    HistoryItemComponent,
    OtherReceiptsIssueHistoryAdvancedPopupComponent
  ],
  entryComponents: [OtherReceiptsIssueHistoryAdvancedPopupComponent],
  exports: [ItemListComponent, OtherReceiptsIssueHistoryAdvancedPopupComponent],
  providers: []
})
export class EpossOtherReceiptIssueUiOtherReceiptIssueHistoryItemListModule {}
