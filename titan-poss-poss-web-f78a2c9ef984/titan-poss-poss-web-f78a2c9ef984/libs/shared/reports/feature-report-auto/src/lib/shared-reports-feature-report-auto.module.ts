import { SharedComponentsUiCheckboxGridModule } from '@poss-web/shared/components/ui-checkbox-grid';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedReportsDataAccessReportsModule } from '@poss-web/shared/reports/data-access-reports';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { ReportAutoGenerationComponent } from './report-auto-generation/report-auto-generation.component';
import { SharedReportsUiReportsModule } from '@poss-web/shared/reports/ui-reports';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: ReportAutoGenerationComponent
  }
];
@NgModule({
  declarations: [ReportAutoGenerationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCheckboxGridModule,
    SharedComponentsUiAgGridModule,
    SharedReportsDataAccessReportsModule,
    SharedReportsUiReportsModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ]
})
export class SharedReportsFeatureReportAutoModule {}
