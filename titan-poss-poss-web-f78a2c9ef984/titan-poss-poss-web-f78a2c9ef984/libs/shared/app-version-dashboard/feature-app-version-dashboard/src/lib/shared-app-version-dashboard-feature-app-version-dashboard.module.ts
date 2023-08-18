import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AppVersionDashboardComponent } from './app-version-dashboard/app-version-dashboard.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedAppVersionDashboardUiAppVersionGridModule } from '@poss-web/shared/app-version-dashboard/ui-app-version-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedAppVersionDashboardDataAccessAppVersionDashboardModule } from '@poss-web/shared/app-version-dashboard/data-access-app-version-dashboard';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

const routes: Routes = [
  {
    path: '',
    component: AppVersionDashboardComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedAppVersionDashboardUiAppVersionGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedAppVersionDashboardDataAccessAppVersionDashboardModule
  ],
  declarations: [AppVersionDashboardComponent],
  providers: [SelectionDialogService]
})
export class SharedAppVersionDashboardFeatureAppVersionDashboardModule {}
