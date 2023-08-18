import { NgModule } from '@angular/core';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { IbtCancellationRequestApprovalsItemListComponent } from './item-list/ibt-cancellation-request-approvals-item-list.component';
import { IbtCancellationRequestApprovalsItemComponent } from './item/ibt-cancellation-request-approvals-item.component';
import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
@NgModule({
  declarations: [IbtCancellationRequestApprovalsItemListComponent, IbtCancellationRequestApprovalsItemComponent],
  imports: [CommonCustomMaterialModule, SharedComponentsUiFormattersModule,SharedComponentsUiThumbnailModule, SharedComponentsUiFormattersModule, SharedComponentsUiFocusableListModule,
    SharedItemUiItemDetailsModule],
  exports: [IbtCancellationRequestApprovalsItemListComponent, IbtCancellationRequestApprovalsItemComponent],
})
export class EpossRequestApprovalsUiIbtCancelRequestItemListModule {}
