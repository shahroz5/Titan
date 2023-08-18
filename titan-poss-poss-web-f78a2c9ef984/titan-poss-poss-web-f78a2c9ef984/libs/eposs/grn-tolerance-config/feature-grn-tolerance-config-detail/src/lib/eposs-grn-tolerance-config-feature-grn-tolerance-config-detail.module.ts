import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { EpossGrnToleranceConfigDataAccessGrnToleranceConfigModule } from '@poss-web/eposs/grn-tolerance-config/data-access-grn-tolerance-config';
import { EpossGrnToleranceConfigUiGrnToleranceConfigDetailModule } from '@poss-web/eposs/grn-tolerance-config/ui-grn-tolerance-config-detail';
import { WeightValueConfigMainComponent } from './weight-value-config-main.component';
import { EpossGrnToleranceConfigUiGrnToleranceConfigViewModule } from '@poss-web/eposs/grn-tolerance-config/ui-grn-tolerance-config-view';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';
const routes: Routes = [
  {
    path: '',
    component: WeightValueConfigMainComponent
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
    EpossGrnToleranceConfigUiGrnToleranceConfigDetailModule,
    EpossGrnToleranceConfigUiGrnToleranceConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [WeightValueConfigMainComponent],
  providers: [SelectionDialogService]
})
export class EpossGrnToleranceConfigFeatureGrnToleranceConfigDetailModule {}
