import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password.component';
import { SharedForgotPasswordUiForgotPasswordModule } from '@poss-web/shared/forgot-password/ui-forgot-password';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedActivateUserDataAccessActivateUserModule } from '@poss-web/shared/activate-user/data-access-activate-user';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedActivateUserDataAccessActivateUserModule,
    SharedForgotPasswordUiForgotPasswordModule,
    RouterModule.forChild([
      { path: '', component: ForgotPasswordComponent },
      { path: 'verify-otp', component: ForgotPasswordComponent }
    ])
  ],
  declarations: [ForgotPasswordComponent]
})
export class SharedForgotPasswordFeatureForgotPasswordModule {}
