import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { EpossGrnInterboutiqueConfigDataAccessGrnInterboutiqueConfigModule } from '@poss-web/eposs/grn-interboutique-config/data-access-grn-interboutique-config';
import { EpossGrnInterboutiqueConfigUiGrnInterboutiqueConfigModule } from '@poss-web/eposs/grn-interboutique-config/ui-grn-interboutique-config';

import { GrnInterboutiqueConfigFeatureComponent } from './grn-interboutique-config-feature.component';

import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: GrnInterboutiqueConfigFeatureComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossGrnInterboutiqueConfigDataAccessGrnInterboutiqueConfigModule,
    EpossGrnInterboutiqueConfigUiGrnInterboutiqueConfigModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [GrnInterboutiqueConfigFeatureComponent]
})
export class EpossGrnInterboutiqueConfigFeatureGrnInterboutiqueConfigModule {}
