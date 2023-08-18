import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordStep1Component } from './forgot-password-step-1/forgot-password-step-1.component';
import { ForgotPasswordStep2Component } from './forgot-password-step-2/forgot-password-step-2.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule, RouterModule, SharedComponentsUiFormFieldControlsModule],
  declarations: [ForgotPasswordStep1Component, ForgotPasswordStep2Component],
  exports: [ForgotPasswordStep1Component, ForgotPasswordStep2Component]
})
export class SharedForgotPasswordUiForgotPasswordModule { }
