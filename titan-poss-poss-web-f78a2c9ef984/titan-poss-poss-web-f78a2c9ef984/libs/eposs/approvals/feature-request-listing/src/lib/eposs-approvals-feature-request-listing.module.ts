import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RequestListingComponent } from './request-listing.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedRoleConfigUiRequestListModule } from '@poss-web/shared/role-config/ui-request-list';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedRoleConfigDataAccessRoleConfigModule } from '@poss-web/shared/role-config/data-access-role-config';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';

const route: Routes = [{ path: '', component: RequestListingComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedRoleConfigUiRequestListModule,
    SharedComponentsUiLoaderModule,
    SharedRoleConfigDataAccessRoleConfigModule,
    SharedComponentsUiSelectionDialogModule
  ],
  declarations: [RequestListingComponent]
})
export class EpossApprovalsFeatureRequestListingModule {}
