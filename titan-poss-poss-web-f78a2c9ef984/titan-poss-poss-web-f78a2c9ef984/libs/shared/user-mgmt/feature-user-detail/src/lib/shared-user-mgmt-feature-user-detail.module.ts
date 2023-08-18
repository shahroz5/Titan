import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUserMgmtDataAccessUserModule } from '@poss-web/shared/user-mgmt/data-access-user';
import { SharedUserMgmtUiUserDetailModule } from '@poss-web/shared/user-mgmt/ui-user-detail';
import { UserDetailComponent } from './user-detail.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedUserMgmtDataAccessUserModule,
    SharedUserMgmtUiUserDetailModule,
    RouterModule.forChild([{ path: '', component: UserDetailComponent }])
  ],
  declarations: [UserDetailComponent]
})
export class SharedUserMgmtFeatureUserDetailModule {}
