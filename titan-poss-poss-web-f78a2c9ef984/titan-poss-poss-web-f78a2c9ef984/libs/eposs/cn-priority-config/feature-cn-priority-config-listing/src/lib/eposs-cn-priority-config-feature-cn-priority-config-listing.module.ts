import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnPriorityConfigListComponent } from './cn-priority-config-list/cn-priority-config-list.component';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossCnPriorityConfigDataAccessCnPriorityConfigModule } from '@poss-web/eposs/cn-priority-config/data-access-cn-priority-config';
import { EpossCnPriorityConfigUiCnPriorityConfigListingModule } from '@poss-web/eposs/cn-priority-config/ui-cn-priority-config-listing';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const route: Route[] = [{ path: '', component: CnPriorityConfigListComponent }];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossCnPriorityConfigDataAccessCnPriorityConfigModule,
    EpossCnPriorityConfigUiCnPriorityConfigListingModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [CnPriorityConfigListComponent]
})
export class EpossCnPriorityConfigFeatureCnPriorityConfigListingModule {}
