import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CoToleranceConfigDetailsComponent } from './co-tolerance-config-details/co-tolerance-config-details.component';
import { EpossCoToleranceConfigDataAccessCoToleranceConfigModule } from '@poss-web/eposs/co-tolerance-config/data-access-co-tolerance-config';
import { EpossCoToleranceConfigUiCoToleranceConfigDetailsModule } from '@poss-web/eposs/co-tolerance-config/ui-co-tolerance-config-details';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { EpossCoToleranceConfigUiCoToleranceConfigViewModule } from '@poss-web/eposs/co-tolerance-config/ui-co-tolerance-config-view';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

const route: Route[] = [
  { path: '', component: CoToleranceConfigDetailsComponent }
];
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiToggleButtonModule,
    EpossCoToleranceConfigDataAccessCoToleranceConfigModule,
    EpossCoToleranceConfigUiCoToleranceConfigDetailsModule,
    SharedComponentsUiFormFieldControlsModule,
    EpossCoToleranceConfigUiCoToleranceConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [CoToleranceConfigDetailsComponent],
  providers: [SelectionDialogService]
})
export class EpossCoToleranceConfigFeatureCoToleranceConfigDetailsModule {}
