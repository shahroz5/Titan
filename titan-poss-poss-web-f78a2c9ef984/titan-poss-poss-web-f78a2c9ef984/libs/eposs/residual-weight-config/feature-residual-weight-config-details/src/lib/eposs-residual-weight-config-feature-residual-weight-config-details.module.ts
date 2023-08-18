import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { ResidualWeightDetailsComponent } from './residual-weight-details/residual-weight-details.component';
import { EpossResidualWeightConfigDataAccessResidualWeightConfigModule } from '@poss-web/eposs/residual-weight-config/data-access-residual-weight-config';
import { EpossResidualWeightConfigUiResidualWeightConfigDetailsModule } from '@poss-web/eposs/residual-weight-config/ui-residual-weight-config-details';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { EpossResidualWeightConfigUiResidualWeightConfigViewModule } from '@poss-web/eposs/residual-weight-config/ui-residual-weight-config-view';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

const route: Route[] = [
  { path: '', component: ResidualWeightDetailsComponent }
];
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    EpossResidualWeightConfigDataAccessResidualWeightConfigModule,
    EpossResidualWeightConfigUiResidualWeightConfigDetailsModule,
    SharedComponentsUiToggleButtonModule,
    EpossResidualWeightConfigUiResidualWeightConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [ResidualWeightDetailsComponent],
  providers: [SelectionDialogService]
})
export class EpossResidualWeightConfigFeatureResidualWeightConfigDetailsModule {}
