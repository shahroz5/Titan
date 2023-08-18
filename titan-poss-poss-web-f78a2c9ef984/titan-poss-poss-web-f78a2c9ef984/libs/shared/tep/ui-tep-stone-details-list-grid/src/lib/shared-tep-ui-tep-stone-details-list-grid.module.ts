import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

import { TepStoneDetailsListGridComponent } from './tep-stone-details-list-grid/tep-stone-details-list-grid.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [TepStoneDetailsListGridComponent],
  exports: [TepStoneDetailsListGridComponent]
})
export class SharedTepUiTepStoneDetailsListGridModule {}
