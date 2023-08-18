import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RequestListingComponent } from './request-listing.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedRoleConfigDataAccessRoleConfigModule } from '@poss-web/shared/role-config/data-access-role-config';
import { SharedRoleConfigUiRequestListModule } from '@poss-web/shared/role-config/ui-request-list';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedRoleConfigDataAccessRoleConfigModule,
    SharedRoleConfigUiRequestListModule,
    RouterModule.forChild([{ path: '', component: RequestListingComponent }])
  ],
  declarations: [RequestListingComponent]
})
export class SharedRoleConfigFeatureRequestListingModule {}
