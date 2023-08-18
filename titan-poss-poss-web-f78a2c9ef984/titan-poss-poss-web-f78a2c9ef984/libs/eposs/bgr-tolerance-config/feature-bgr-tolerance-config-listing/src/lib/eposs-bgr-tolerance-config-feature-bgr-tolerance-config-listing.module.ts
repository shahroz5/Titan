import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgrToleranceListComponent } from './bgr-tolerance-list/bgr-tolerance-list.component';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossBgrToleranceConfigDataAccessBgrToleranceConfigModule } from '@poss-web/eposs/bgr-tolerance-config/data-access-bgr-tolerance-config';
import { EpossBgrToleranceConfigUiBgrToleranceConfigListingModule } from '@poss-web/eposs/bgr-tolerance-config/ui-bgr-tolerance-config-listing';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const route: Route[] = [{ path: '', component: BgrToleranceListComponent }];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossBgrToleranceConfigDataAccessBgrToleranceConfigModule,
    EpossBgrToleranceConfigUiBgrToleranceConfigListingModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [BgrToleranceListComponent]
})
export class EpossBgrToleranceConfigFeatureBgrToleranceConfigListingModule {}
