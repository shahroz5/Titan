import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BcHistoryGridComponent } from './bc-history-grid/bc-history-grid.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { BcHistoryFormComponent } from './bc-history-form/bc-history-form.component';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { BcCnSelectionPopupComponent } from './bc-cn-selection-popup/bc-cn-selection-popup.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [
    BcHistoryGridComponent,
    BcHistoryFormComponent,
    BcCnSelectionPopupComponent
  ],
  exports: [
    BcHistoryGridComponent,
    BcHistoryFormComponent,
    BcCnSelectionPopupComponent
  ],
  entryComponents: [BcCnSelectionPopupComponent]
})
export class PossBcUiBcHistoryModule {}
