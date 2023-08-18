import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TepApprovalListItemsComponent } from './tep-approval-list-items/tep-approval-list-items.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { TepRemarksPopupComponent } from './tep-remarks-popup/tep-remarks-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [TepApprovalListItemsComponent, TepRemarksPopupComponent],
  exports: [TepApprovalListItemsComponent],
  entryComponents: [TepRemarksPopupComponent]
})
export class EpossTepApprovalUiTepApprovalModule {}
