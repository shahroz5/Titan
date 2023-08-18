import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { EpossGrnToleranceConfigDataAccessGrnToleranceConfigModule } from '@poss-web/eposs/grn-tolerance-config/data-access-grn-tolerance-config';
import { EpossGrnToleranceConfigUiGrnToleranceConfigListModule } from '@poss-web/eposs/grn-tolerance-config/ui-grn-tolerance-config-list';

import { WeightValueConfigListingComponent } from './weight-value-config-listing.component';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: WeightValueConfigListingComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    EpossGrnToleranceConfigDataAccessGrnToleranceConfigModule,
    EpossGrnToleranceConfigUiGrnToleranceConfigListModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [WeightValueConfigListingComponent]
})
export class EpossGrnToleranceConfigFeatureGrnToleranceConfigListingModule {}
