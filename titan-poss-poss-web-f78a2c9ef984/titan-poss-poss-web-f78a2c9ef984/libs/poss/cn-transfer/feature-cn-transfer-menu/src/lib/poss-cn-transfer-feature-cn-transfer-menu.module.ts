import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedPermissionUtilElementPermissionsModule } from '@poss-web/shared/permission/util-element-permissions';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { CnTransferMenuComponent } from './cn-transfer-menu/cn-transfer-menu.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPermissionUtilElementPermissionsModule,
    SharedPermissionDataAccessPermissionModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [CnTransferMenuComponent],
  exports: [CnTransferMenuComponent]
})
export class PossCnTransferFeatureCnTransferMenuModule {}
