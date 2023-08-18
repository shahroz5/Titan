import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { AbToleranceConfigDetailsComponent } from './ab-tolerance-config-details/ab-tolerance-config-details.component';
import { EpossAbToleranceConfigDataAccessAbToleranceConfigModule } from '@poss-web/eposs/ab-tolerance-config/data-access-ab-tolerance-config';
import { EpossAbToleranceConfigUiAbToleranceConfigDetailsModule } from '@poss-web/eposs/ab-tolerance-config/ui-ab-tolerance-config-details';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { EpossAbToleranceConfigUiAbToleranceConfigViewModule } from '@poss-web/eposs/ab-tolerance-config/ui-ab-tolerance-config-view';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

const route: Route[] = [
  { path: '', component: AbToleranceConfigDetailsComponent }
];
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiToggleButtonModule,
    EpossAbToleranceConfigDataAccessAbToleranceConfigModule,
    EpossAbToleranceConfigUiAbToleranceConfigDetailsModule,
    SharedComponentsUiFormFieldControlsModule,
    EpossAbToleranceConfigUiAbToleranceConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [AbToleranceConfigDetailsComponent],
  providers: [SelectionDialogService]
})
export class EpossAbToleranceConfigFeatureAbToleranceConfigDetailsModule {}
