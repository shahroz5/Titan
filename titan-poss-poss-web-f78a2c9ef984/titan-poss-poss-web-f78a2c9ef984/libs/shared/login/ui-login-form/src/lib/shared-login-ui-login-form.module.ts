import { SharedComponentsUiPasswordModule } from '@poss-web/shared/components/ui-password';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoginFormComponent } from './login-form.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiPasswordModule
  ],
  exports: [LoginFormComponent]
})
export class SharedLoginUiLoginFormModule {}
