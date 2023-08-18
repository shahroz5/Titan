import { SharedComponentsUiCheckboxGridModule } from '@poss-web/shared/components/ui-checkbox-grid';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedReportsDataAccessReportsModule } from '@poss-web/shared/reports/data-access-reports';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { ReportRoleMappingComponent } from './report-role-mapping/report-role-mapping.component';
import { SharedReportsUiReportsModule } from '@poss-web/shared/reports/ui-reports';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

const routes: Routes = [
  {
    path: '',
    component: ReportRoleMappingComponent
  }
];
@NgModule({
  declarations: [ReportRoleMappingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCheckboxGridModule,
    SharedComponentsUiAgGridModule,
    SharedReportsDataAccessReportsModule,
    SharedReportsUiReportsModule,
    SharedComponentsUiFormFieldControlsModule
  ]
})
export class SharedReportsFeatureReportRoleMapingModule {}
