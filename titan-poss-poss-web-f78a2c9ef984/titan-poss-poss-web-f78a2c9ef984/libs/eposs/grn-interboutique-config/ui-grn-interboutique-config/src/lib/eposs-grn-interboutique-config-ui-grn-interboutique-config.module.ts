import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { GrnInterboutiqueConfigDetailsComponent } from './grn-interboutique-config-details.component';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [GrnInterboutiqueConfigDetailsComponent],
  exports: [GrnInterboutiqueConfigDetailsComponent]
})
export class EpossGrnInterboutiqueConfigUiGrnInterboutiqueConfigModule {}
