import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedReportsUiReportsModule } from '@poss-web/shared/reports/ui-reports';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedReportsDataAccessReportsModule } from '@poss-web/shared/reports/data-access-reports';
import { ReportListComponent } from './report-list/report-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReportListComponent
  }
];
@NgModule({
  declarations: [ReportListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedReportsDataAccessReportsModule,
    SharedReportsUiReportsModule,
    SharedComponentsUiFormFieldControlsModule
  ]
})
export class SharedReportsFeatureReportListModule {}
