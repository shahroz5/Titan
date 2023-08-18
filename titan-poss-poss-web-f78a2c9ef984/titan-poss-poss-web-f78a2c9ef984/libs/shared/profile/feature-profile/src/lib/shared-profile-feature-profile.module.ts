import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUserMgmtDataAccessUserModule } from '@poss-web/shared/user-mgmt/data-access-user';
import { SharedProfileUiProfileModule } from '@poss-web/shared/profile/ui-profile';
import { SharedProfileUiChangePasswordModule } from '@poss-web/shared/profile/ui-change-password';
import { SharedProfileUiVerifyMobileModule } from '@poss-web/shared/profile/ui-verify-mobile';
import { SharedProfileDataAccessProfileModule } from '@poss-web/shared/profile/data-access-profile';
import { SharedProfileUiCashierSignatureModule } from '@poss-web/shared/profile/ui-cashier-signature';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedUserMgmtDataAccessUserModule,
    SharedProfileUiProfileModule,
    SharedProfileUiChangePasswordModule,
    SharedProfileUiVerifyMobileModule,
    SharedProfileDataAccessProfileModule,
    SharedProfileUiCashierSignatureModule,
    RouterModule
  ],
  declarations: [ProfileComponent]
})
export class SharedProfileFeatureProfileModule {}
