import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
import { IbtRequestApprovalsItemListComponent } from './item-list/ibt-request-approvals-item-list.component';
import { IbtRequestApprovalsItemComponent } from './item/ibt-request-approvals-item.component';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
@NgModule({
  declarations: [IbtRequestApprovalsItemComponent, IbtRequestApprovalsItemListComponent],
  imports: [CommonCustomMaterialModule, SharedComponentsUiThumbnailModule, SharedComponentsUiFormattersModule, SharedComponentsUiFocusableListModule,
    SharedItemUiItemDetailsModule],
  exports: [IbtRequestApprovalsItemComponent, IbtRequestApprovalsItemListComponent],
})
export class EpossRequestApprovalsUiIbtRequestApprovalsItemListModule { }
