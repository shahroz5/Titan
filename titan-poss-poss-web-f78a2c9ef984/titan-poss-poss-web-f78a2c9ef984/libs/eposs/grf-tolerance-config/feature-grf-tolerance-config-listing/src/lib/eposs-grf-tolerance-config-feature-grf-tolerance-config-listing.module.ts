import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { EpossGrfToleranceConfigDataAccessGrfToleranceConfigModule } from '@poss-web/eposs/grf-tolerance-config/data-access-grf-tolerance-config'
import { EpossGrfToleranceConfigUiGrfToleranceConfigListModule } from '@poss-web/eposs/grf-tolerance-config/ui-grf-tolerance-config-list'

import { WeightValueConfigListingComponent } from './weight-value-config-listing.component';

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
    EpossGrfToleranceConfigDataAccessGrfToleranceConfigModule,
    EpossGrfToleranceConfigUiGrfToleranceConfigListModule
  ],
  declarations: [WeightValueConfigListingComponent],
})
export class EpossGrfToleranceConfigFeatureGrfToleranceConfigListingModule { }
