import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateMetalRatesComponent } from './update-metal-rates/update-metal-rates.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [UpdateMetalRatesComponent],
  exports: [UpdateMetalRatesComponent]
})
export class PossMetalRatesUiUpdateMetalRatesModule {}
