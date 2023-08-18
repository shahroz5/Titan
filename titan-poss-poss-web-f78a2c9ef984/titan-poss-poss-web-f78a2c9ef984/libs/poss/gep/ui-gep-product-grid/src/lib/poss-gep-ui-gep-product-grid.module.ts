import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GepProductGridComponent } from './gep-product-grid/gep-product-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import {
  SharedComponentsUiAgGridModule,
  EditItemComponent,
  InputValidatorComponent,
  DeleteRowComponent
} from '@poss-web/shared/components/ui-ag-grid';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

import { GepProductCheckboxCellComponent } from './gep-product-grid/gep-produt-checkbox-cell.componet';
import { TotalValuePopupComponent } from './total-value-popup/total-value-popup.component';
import { PreMeltingDetailsComponent } from './pre-melting-details/pre-melting-details.component';
import { PreMeltingPopupComponent } from './pre-melting-popup/pre-melting-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormattersModule,
    AgGridModule.withComponents([
      DeleteRowComponent,
      InputValidatorComponent,
      EditItemComponent
    ]),
    SharedComponentsUiAgGridModule
  ],
  declarations: [
    GepProductGridComponent,
    GepProductCheckboxCellComponent,
    TotalValuePopupComponent,
    PreMeltingDetailsComponent,
    PreMeltingPopupComponent
  ],
  entryComponents: [
    TotalValuePopupComponent,
    DeleteRowComponent,
    PreMeltingDetailsComponent,
    PreMeltingPopupComponent
  ],
  exports: [
    GepProductGridComponent,
    PreMeltingDetailsComponent,
    PreMeltingPopupComponent,
    TotalValuePopupComponent
  ]
})
export class PossGepUiGepProductGridModule {}
