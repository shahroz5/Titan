import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RoRequestListComponent } from './ro-request-list/ro-request-list.component';
import { RemarkDialogComponent } from './remark-dialog/remark-dialog.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [RoRequestListComponent, RemarkDialogComponent],
  exports: [RoRequestListComponent, RemarkDialogComponent]
})
export class SharedRoRequestApprovalsUiRoRequestApprovalsStatusModule {}
