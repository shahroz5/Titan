import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestDetailComponent } from './request-detail.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [RequestDetailComponent],
  exports: [RequestDetailComponent]
})
export class SharedRoleConfigUiRequestDetailModule {}
