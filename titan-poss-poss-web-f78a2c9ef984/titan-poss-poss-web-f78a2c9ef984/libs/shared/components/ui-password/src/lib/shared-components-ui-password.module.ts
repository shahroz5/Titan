import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PasswordComponent } from './password.component';

@NgModule({
  declarations: [PasswordComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  exports: [PasswordComponent]
})
export class SharedComponentsUiPasswordModule {}
