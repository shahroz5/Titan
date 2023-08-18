import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdatePasswordComponent } from './update-password.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [UpdatePasswordComponent],
  entryComponents: [UpdatePasswordComponent]
})
export class SharedProfileUiChangePasswordModule {}
