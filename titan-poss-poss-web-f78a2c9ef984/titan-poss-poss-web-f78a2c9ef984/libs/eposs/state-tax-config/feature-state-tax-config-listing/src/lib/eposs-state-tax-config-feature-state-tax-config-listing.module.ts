import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateTaxConfigListingComponent } from './state-tax-config-listing.component';

import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { EpossStateTaxConfigDataAccessStateTaxConfigModule } from '@poss-web/eposs/state-tax-config/data-access-state-tax-config';
import { EpossStateTaxConfigUiStateTaxConfigDetailModule } from '@poss-web/eposs/state-tax-config/ui-state-tax-config-detail';
import { EpossStateTaxConfigUiStateTaxConfigListModule } from '@poss-web/eposs/state-tax-config/ui-state-tax-config-list';

const routes: Routes = [
  {
    path: '',
    component: StateTaxConfigListingComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    EpossStateTaxConfigDataAccessStateTaxConfigModule,
    EpossStateTaxConfigUiStateTaxConfigDetailModule,
    EpossStateTaxConfigUiStateTaxConfigListModule
  ],
  declarations: [StateTaxConfigListingComponent],
})
export class EpossStateTaxConfigFeatureStateTaxConfigListingModule {}
