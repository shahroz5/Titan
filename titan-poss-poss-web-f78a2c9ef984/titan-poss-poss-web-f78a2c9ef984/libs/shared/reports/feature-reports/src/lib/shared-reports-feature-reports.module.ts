import { SharedReportsUiReportsModule } from '@poss-web/shared/reports/ui-reports';
import { SharedReportsDataAccessReportsModule } from '@poss-web/shared/reports/data-access-reports';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { GenerateReportComponent } from './generate-report/generate-report.component';

const routes: Routes = [
  {
    path: 'generate-report',
    component: GenerateReportComponent
  }
];
@NgModule({
  declarations: [GenerateReportComponent],
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
export class SharedReportsFeatureReportsModule {}
