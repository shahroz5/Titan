import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TepExceptionListItemsComponent } from './tep-exception-list-items/tep-exception-list-items.component';
import { TepExceptionRemarkPopUpComponent } from './tep-exception-remark-pop-up/tep-exception-remark-pop-up.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
@NgModule({
  imports: [CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule],
  declarations: [TepExceptionListItemsComponent, TepExceptionRemarkPopUpComponent],
  exports: [TepExceptionListItemsComponent, TepExceptionRemarkPopUpComponent],
  entryComponents: [TepExceptionRemarkPopUpComponent]
})
export class EpossTepApprovalUiTepExceptionApprovalModule {}
