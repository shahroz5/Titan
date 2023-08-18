import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { EpossGrfToleranceConfigDataAccessGrfToleranceConfigModule } from '@poss-web/eposs/grf-tolerance-config/data-access-grf-tolerance-config';
import { EpossGrfToleranceConfigUiGrfToleranceConfigDetailModule } from '@poss-web/eposs/grf-tolerance-config/ui-grf-tolerance-config-detail';

import { WeightValueConfigMainComponent } from './weight-value-config-main.component';
import { EpossGrfToleranceConfigUiGrfToleranceConfigViewModule } from '@poss-web/eposs/grf-tolerance-config/ui-grf-tolerance-config-view';
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
    EpossGrfToleranceConfigDataAccessGrfToleranceConfigModule,
    EpossGrfToleranceConfigUiGrfToleranceConfigDetailModule,
    EpossGrfToleranceConfigUiGrfToleranceConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [WeightValueConfigMainComponent],
  providers: [SelectionDialogService]
})
export class EpossGrfToleranceConfigFeatureGrfToleranceConfigDetailModule {}
