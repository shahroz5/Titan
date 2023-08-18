import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';

import { StateTaxConfigDetailsMainComponent } from './state-tax-config-details-main/state-tax-config-details-main.component';

import { EpossStateTaxConfigDataAccessStateTaxConfigModule } from '@poss-web/eposs/state-tax-config/data-access-state-tax-config';
import { EpossStateTaxConfigUiStateTaxConfigDetailModule } from '@poss-web/eposs/state-tax-config/ui-state-tax-config-detail';
import { EpossStateTaxConfigUiStateTaxConfigListModule } from '@poss-web/eposs/state-tax-config/ui-state-tax-config-list';
import { EpossStateTaxConfigUiStateTaxConfigViewModule } from '@poss-web/eposs/state-tax-config/ui-state-tax-config-view';

const routes: Routes = [
  {
    path: '',
    component: StateTaxConfigDetailsMainComponent
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
    EpossStateTaxConfigUiStateTaxConfigListModule,
    EpossStateTaxConfigUiStateTaxConfigViewModule
  ],
  declarations: [StateTaxConfigDetailsMainComponent]
})
export class EpossStateTaxConfigFeatureStateTaxConfigDetailModule {}
