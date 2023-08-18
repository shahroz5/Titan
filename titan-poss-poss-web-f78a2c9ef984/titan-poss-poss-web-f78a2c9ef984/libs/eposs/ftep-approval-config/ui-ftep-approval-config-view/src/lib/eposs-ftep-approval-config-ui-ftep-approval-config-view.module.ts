import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FtepApprovalConfigViewComponent } from './ftep-approval-config-view/ftep-approval-config-view.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiToggleButtonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [FtepApprovalConfigViewComponent],
  exports: [FtepApprovalConfigViewComponent]
})
export class EpossFtepApprovalConfigUiFtepApprovalConfigViewModule {}
