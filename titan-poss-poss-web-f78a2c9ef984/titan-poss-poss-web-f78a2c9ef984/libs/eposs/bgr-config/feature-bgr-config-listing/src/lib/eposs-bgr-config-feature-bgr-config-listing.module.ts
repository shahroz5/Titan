import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { EpossBgrConfigDataAccessBgrConfigModule } from '@poss-web/eposs/bgr-config/data-access-bgr-config';
import { EpossBgrConfigUiBgrConfigListModule } from '@poss-web/eposs/bgr-config/ui-bgr-config-list';

import { BgrConfigListingComponent } from './bgr-config-listing.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: BgrConfigListingComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    EpossBgrConfigDataAccessBgrConfigModule,
    EpossBgrConfigUiBgrConfigListModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [BgrConfigListingComponent]
})
export class EpossBgrConfigFeatureBgrConfigListingModule {}
