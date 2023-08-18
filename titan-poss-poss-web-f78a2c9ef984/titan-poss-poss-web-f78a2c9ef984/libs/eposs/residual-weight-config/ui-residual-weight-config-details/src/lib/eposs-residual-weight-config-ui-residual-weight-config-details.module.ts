import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidualWeightConfigUiGridComponent } from './residual-weight-config-ui-grid/residual-weight-config-ui-grid.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { ResidualTolerancePopupComponent } from './residual-tolerance-popup/residual-tolerance-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [
    ResidualWeightConfigUiGridComponent,
    ResidualTolerancePopupComponent
  ],
  exports: [ResidualWeightConfigUiGridComponent]
})
export class EpossResidualWeightConfigUiResidualWeightConfigDetailsModule {}
