import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { BgrToleranceConfigDetailsComponent } from './bgr-tolerance-config-details/bgr-tolerance-config-details.component';
import { EpossBgrToleranceConfigDataAccessBgrToleranceConfigModule } from '@poss-web/eposs/bgr-tolerance-config/data-access-bgr-tolerance-config';
import { EpossBgrToleranceConfigUiBgrToleranceConfigDetailsModule } from '@poss-web/eposs/bgr-tolerance-config/ui-bgr-tolerance-config-details';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { EpossBgrToleranceConfigUiBgrToleranceConfigViewModule } from '@poss-web/eposs/bgr-tolerance-config/ui-bgr-tolerance-config-view';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

const route: Route[] = [
  { path: '', component: BgrToleranceConfigDetailsComponent }
];
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiToggleButtonModule,
    EpossBgrToleranceConfigDataAccessBgrToleranceConfigModule,
    EpossBgrToleranceConfigUiBgrToleranceConfigDetailsModule,
    SharedComponentsUiFormFieldControlsModule,
    EpossBgrToleranceConfigUiBgrToleranceConfigViewModule,
    SharedLocationMappingDataAccessLocationMappingModule
  ],
  declarations: [BgrToleranceConfigDetailsComponent],
  providers: [SelectionDialogService]
})
export class EpossBgrToleranceConfigFeatureBgrToleranceConfigDetailsModule {}
