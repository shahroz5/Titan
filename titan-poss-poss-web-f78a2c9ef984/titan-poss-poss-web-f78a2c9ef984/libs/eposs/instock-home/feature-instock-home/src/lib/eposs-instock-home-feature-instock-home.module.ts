import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { InstockHomeComponent } from './instock-home.component';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [InstockHomeComponent],
  exports: [InstockHomeComponent]
})
export class EpossInstockHomeFeatureInstockHomeModule {}
