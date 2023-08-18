import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefundListGridComponent } from './refund-list-grid/refund-list-grid.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { UtrDetailsPopUpComponent } from './utr-details-pop-up/utr-details-pop-up.component';
import { ChequeDetailsPopUpComponent } from './cheque-details-pop-up/cheque-details-pop-up.component';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiSelectionDialogModule
  ],
  declarations: [
    RefundListGridComponent,
    UtrDetailsPopUpComponent,
    ChequeDetailsPopUpComponent
  ],
  exports: [RefundListGridComponent],
  entryComponents: [UtrDetailsPopUpComponent, ChequeDetailsPopUpComponent]
})
export class EpossTepApprovalUiRefundListGridModule {}
