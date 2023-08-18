import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { EpossBgrConfigDataAccessBgrConfigModule } from '@poss-web/eposs/bgr-config/data-access-bgr-config';
import { EpossBgrConfigUiBgrConfigDetailModule } from '@poss-web/eposs/bgr-config/ui-bgr-config-detail';
import { SharedLocationMappingDataAccessLocationMappingModule } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import { BgrConfigDetailComponent } from './bgr-config-detail/bgr-config-detail.component';
import { LocationMappingFailureAlertPopUpComponent } from './location-mapping-failure-alert-pop-up/location-mapping-failure-alert-pop-up.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { EpossBgrConfigUiBgrConfigViewModule } from '@poss-web/eposs/bgr-config/ui-bgr-config-view';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';


const routes: Routes = [
  {
    path: '',
    component: BgrConfigDetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    EpossBgrConfigDataAccessBgrConfigModule,
    EpossBgrConfigUiBgrConfigDetailModule,
    SharedLocationMappingDataAccessLocationMappingModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormFieldControlsModule,
    EpossBgrConfigUiBgrConfigViewModule

  ],
  declarations: [
    BgrConfigDetailComponent,
    LocationMappingFailureAlertPopUpComponent
  ],
  entryComponents: [LocationMappingFailureAlertPopUpComponent],
  providers: [SelectionDialogService]
})
export class EpossBgrConfigFeatureBgrConfigDetailModule {}
