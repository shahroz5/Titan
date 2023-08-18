import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaxFlatTepConfigComponent } from './max-flat-tep-config/max-flat-tep-config.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [MaxFlatTepConfigComponent],
  exports: [MaxFlatTepConfigComponent]
})
export class EpossMaxFlatTepConfigUiMaxFlatTepConfigModule {}
