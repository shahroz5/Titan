import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedUserMgmtDataAccessUserModule } from '@poss-web/shared/user-mgmt/data-access-user';
import { SharedUserMgmtUiUserListModule } from '@poss-web/shared/user-mgmt/ui-user-list';
import { UserListingComponent } from './user-listing.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedUserMgmtUiUserListModule,
    SharedUserMgmtDataAccessUserModule,
    SharedComponentsUiFilterDialogModule,
    RouterModule.forChild([{ path: '', component: UserListingComponent }])
  ],
  declarations: [UserListingComponent]
})
export class SharedUserMgmtFeatureUserListingModule {}
