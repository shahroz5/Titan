import { OtherIssuesApprovalsItemComponent } from './item/other-issues-approvals-item.component';
import { OtherIssueApprovalsItemListComponent } from './item-list/other-issue-approvals-item-list.component';
import { NgModule } from '@angular/core';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedItemUiItemDetailsModule } from '@poss-web/shared/item/ui-item-details';
@NgModule({
  declarations: [OtherIssueApprovalsItemListComponent, OtherIssuesApprovalsItemComponent],
  imports: [CommonCustomMaterialModule, SharedComponentsUiThumbnailModule, SharedComponentsUiFormattersModule, SharedComponentsUiFormattersModule, SharedComponentsUiFocusableListModule,
    SharedItemUiItemDetailsModule,],
  exports: [OtherIssueApprovalsItemListComponent, OtherIssuesApprovalsItemComponent],
})
export class EpossRequestApprovalsUiOtherIssueApprovalsItemListModule { }
