import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedLoginUiLoginFormModule } from '@poss-web/shared/login/ui-login-form';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { LoginComponent } from './login.component';
import { SharedUserAgentDataAccessUserAgentModule } from '@poss-web/shared/user-agent/data-access-user-agent';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedLoginUiLoginFormModule,
    SharedComponentsUiLoaderModule,
    SharedUserAgentDataAccessUserAgentModule,
    RouterModule.forChild([{ path: '', component: LoginComponent }])
  ]
})
export class SharedLoginFeatureLoginModule {}
