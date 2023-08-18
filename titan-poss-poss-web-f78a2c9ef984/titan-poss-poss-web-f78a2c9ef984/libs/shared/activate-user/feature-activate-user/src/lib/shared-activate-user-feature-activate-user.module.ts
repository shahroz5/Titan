import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedActivateUserDataAccessActivateUserModule } from '@poss-web/shared/activate-user/data-access-activate-user';
import { SharedActivateUserUiActivateUserFormModule } from '@poss-web/shared/activate-user/ui-activate-user-form';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { ActivateUserComponent } from './activate-user.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedActivateUserUiActivateUserFormModule,
    SharedActivateUserDataAccessActivateUserModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild([{ path: '', component: ActivateUserComponent }])
  ],
  declarations: [ActivateUserComponent]
})
export class SharedActivateUserFeatureActivateUserModule {}
