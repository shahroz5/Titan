import { ReportSettingsComponent } from './report-settings/report-settings.component';
import { SharedComponentsUiCheckboxGridModule } from '@poss-web/shared/components/ui-checkbox-grid';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedReportsDataAccessReportsModule } from '@poss-web/shared/reports/data-access-reports';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: ReportSettingsComponent
  }
];
@NgModule({
  declarations: [ReportSettingsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCheckboxGridModule,
    SharedComponentsUiAgGridModule,
    SharedReportsDataAccessReportsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ]
})
export class SharedReportsFeatureReportSettingsModule {}
