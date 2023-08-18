import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedRoRequestApprovalsUiRoRequestApprovalsStatusModule } from '@poss-web/shared/ro-request-approvals/ui-ro-request-approvals-status';
import { SharedRoRequestApprovalsDataAccessRoRequestApprovalsModule } from '@poss-web/shared/ro-request-approvals/data-access-ro-request-approvals';
import { RoRequestStatusComponent } from './ro-request-status/ro-request-status.component';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
const routes: Routes = [
  {
    path: '',
    component: RoRequestStatusComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    //loading the app specific shared components,
    SharedComponentsUiFormFieldControlsModule,
    SharedRoRequestApprovalsUiRoRequestApprovalsStatusModule,
    SharedRoRequestApprovalsDataAccessRoRequestApprovalsModule,
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [RoRequestStatusComponent]
})
export class SharedRoRequestApprovalsFeatureRoRequestApprovalsStatusModule {}
