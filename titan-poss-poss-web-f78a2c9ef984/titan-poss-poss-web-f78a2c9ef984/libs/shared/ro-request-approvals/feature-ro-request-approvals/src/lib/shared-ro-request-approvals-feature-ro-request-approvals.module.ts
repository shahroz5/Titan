import { RoRequestApprovalsComponent } from './ro-request-approvals/ro-request-approvals.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedRoRequestApprovalsUiRoRequestApprovalsStatusModule } from '@poss-web/shared/ro-request-approvals/ui-ro-request-approvals-status';
import { SharedRoRequestApprovalsDataAccessRoRequestApprovalsModule } from '@poss-web/shared/ro-request-approvals/data-access-ro-request-approvals';
import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';
const routes: Routes = [
  {
    path: '',
    component: RoRequestApprovalsComponent
  }
];

@NgModule({
  declarations: [RoRequestApprovalsComponent],
  imports: [
    CommonModule,
    //loading Angular Material and ngx-translate modules
    CommonCustomMaterialModule,
    //loading standard route module from angular
    RouterModule.forChild(routes),
    //loading the Shared Components
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    //loading the app specific shared components,
    SharedRoRequestApprovalsUiRoRequestApprovalsStatusModule,
    SharedRoRequestApprovalsDataAccessRoRequestApprovalsModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedBodEodDataAccessBodEodModule
  ]
})
export class SharedRoRequestApprovalsFeatureRoRequestApprovalsModule {}
