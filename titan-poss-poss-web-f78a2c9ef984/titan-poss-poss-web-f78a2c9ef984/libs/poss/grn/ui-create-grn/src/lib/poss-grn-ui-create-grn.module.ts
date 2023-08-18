import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGrnDetailsComponent } from './create-grn-details/create-grn-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [
    CreateGrnDetailsComponent,
  ],
  exports: [CreateGrnDetailsComponent]
})
export class PossGrnUiCreateGrnModule {}
