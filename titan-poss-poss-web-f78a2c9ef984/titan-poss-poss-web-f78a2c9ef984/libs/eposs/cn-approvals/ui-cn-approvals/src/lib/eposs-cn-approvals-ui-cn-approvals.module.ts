import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnApprovalListItemsComponent } from './cn-approval-list-items/cn-approval-list-items.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [CnApprovalListItemsComponent],
  exports: [CnApprovalListItemsComponent]
})
export class EpossCnApprovalsUiCnApprovalsModule {}
