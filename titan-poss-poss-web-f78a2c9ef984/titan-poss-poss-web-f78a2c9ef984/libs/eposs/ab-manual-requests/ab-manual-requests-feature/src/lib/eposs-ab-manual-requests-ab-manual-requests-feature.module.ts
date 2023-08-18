import { EpossAbManualRequestsUiAbManualRequestsModule } from '@poss-web/eposs/ab-manual-requests/ui-ab-manual-requests';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbManualRequestListComponent } from './ab-manual-request-list/ab-manual-request-list.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { EpossAbManualRequestsDataAccessAbManualRequestsModule } from '@poss-web/eposs/ab-manual-requests/data-access-ab-manual-requests';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
const routes: Routes = [
  {
    path: '',
    component: AbManualRequestListComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    CommonModule,
    EpossAbManualRequestsDataAccessAbManualRequestsModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedCommonDataAccessCommonModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiLoaderModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedComponentsUiFormattersModule,
    EpossAbManualRequestsUiAbManualRequestsModule,
    SharedComponentsUiCardListModule,
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [AbManualRequestListComponent],
  exports: [AbManualRequestListComponent]
})
export class EpossAbManualRequestsAbManualRequestsFeatureModule {}
