import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

import { TepItemsListingGridComponent } from './tep-items-listing-grid/tep-items-listing-grid.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [TepItemsListingGridComponent],
  exports: [TepItemsListingGridComponent]
})
export class SharedTepUiTepItemsGridModule {}
