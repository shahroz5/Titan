import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

import { WeightValueConfigDetailsComponent } from './weight-value-config-details/weight-value-config-details.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [WeightValueConfigDetailsComponent],
  exports: [WeightValueConfigDetailsComponent]
})
export class EpossGrnToleranceConfigUiGrnToleranceConfigDetailModule {}
