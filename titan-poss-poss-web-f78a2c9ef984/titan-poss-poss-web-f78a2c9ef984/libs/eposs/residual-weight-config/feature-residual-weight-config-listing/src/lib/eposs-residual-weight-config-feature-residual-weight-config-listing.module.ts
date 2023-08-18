import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResidualWeightConfigListComponent } from './residual-weight-config-list/residual-weight-config-list.component';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossResidualWeightConfigUiResidualWeightConfigListingModule } from '@poss-web/eposs/residual-weight-config/ui-residual-weight-config-listing';
import { EpossResidualWeightConfigDataAccessResidualWeightConfigModule } from '@poss-web/eposs/residual-weight-config/data-access-residual-weight-config';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

const route: Route[] = [
  { path: '', component: ResidualWeightConfigListComponent }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossResidualWeightConfigUiResidualWeightConfigListingModule,
    EpossResidualWeightConfigDataAccessResidualWeightConfigModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedPermissionDataAccessPermissionModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [ResidualWeightConfigListComponent]
})
export class EpossResidualWeightConfigFeatureResidualWeightConfigListingModule {}
