import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FtepApprovalConfigDetailItemComponent } from './ftep-approval-config-detail-item/ftep-approval-config-detail-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { ErrorPopUpComponent } from './error-pop-up/error-pop-up.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [FtepApprovalConfigDetailItemComponent, ErrorPopUpComponent],
  exports: [FtepApprovalConfigDetailItemComponent, ErrorPopUpComponent]
})
export class EpossFtepApprovalConfigUiFtepApprovalConfigDetailModule {}
