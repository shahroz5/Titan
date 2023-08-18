import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnHistoryComponent } from './grn-history/grn-history.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [GrnHistoryComponent],
  exports: [GrnHistoryComponent]
})
export class PossGrnUiGrnHistoryModule {}
