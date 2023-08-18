import { EpossRequestApprovalsUiBinRequestApprovalsPopupModule } from '@poss-web/eposs/request-approvals/ui-bin-request-approvals-popup';
import { NgModule } from '@angular/core';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { BinRequestItemComponent } from './item/bin-request-item.component';
import { BinRequestItemListComponent } from './item-list/bin-request-item-list.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';


@NgModule({
  declarations: [BinRequestItemComponent, BinRequestItemListComponent],
  imports: [CommonCustomMaterialModule,SharedComponentsUiFormattersModule,  SharedComponentsUiThumbnailModule,EpossRequestApprovalsUiBinRequestApprovalsPopupModule],
  exports: [BinRequestItemComponent, BinRequestItemListComponent]
})
export class EpossRequestApprovalsUiBinRequestItemListModule {}
