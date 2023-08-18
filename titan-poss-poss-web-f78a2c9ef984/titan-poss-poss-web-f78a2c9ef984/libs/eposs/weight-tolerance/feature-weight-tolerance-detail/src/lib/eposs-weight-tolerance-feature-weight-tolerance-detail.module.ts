import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EpossWeightToleranceDataAccessWeightToleranceModule } from '@poss-web/eposs/weight-tolerance/data-access-weight-tolerance';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { WeightToleranceDetailsComponent } from './weight-tolerance-details/weight-tolerance-details.component';
import { EpossWeightToleranceUiWeightToleranceDetailModule } from '@poss-web/eposs/weight-tolerance/ui-weight-tolerance-detail';
import { EpossWeightToleranceUiWeightToleranceViewModule } from '@poss-web/eposs/weight-tolerance/ui-weight-tolerance-view';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

const routes: Route[] = [
  { path: '', component: WeightToleranceDetailsComponent }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    EpossWeightToleranceDataAccessWeightToleranceModule,
    SharedComponentsUiFormattersModule,
    EpossWeightToleranceUiWeightToleranceDetailModule,
    EpossWeightToleranceUiWeightToleranceViewModule,
    SharedLocationMappingDataAccessLocationMappingModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [WeightToleranceDetailsComponent],
  providers: [SelectionDialogService]
})
export class EpossWeightToleranceFeatureWeightToleranceDetailModule {}
