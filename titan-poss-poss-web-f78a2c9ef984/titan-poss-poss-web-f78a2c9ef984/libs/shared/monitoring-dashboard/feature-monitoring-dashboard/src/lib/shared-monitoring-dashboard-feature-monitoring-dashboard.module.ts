import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitoringDashboardComponent } from './monitoring-dashboard/monitoring-dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedMonitoringDashboardUiScheduledJobsListingModule } from '@poss-web/shared/monitoring-dashboard/ui-scheduled-jobs-listing';
import { SharedMonitoringDashboardUiManualTriggerDataSyncModule } from '@poss-web/shared/monitoring-dashboard/ui-manual-trigger-data-sync';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedMonitoringDashboardDataAccessMonitoringDashboardModule } from '@poss-web/shared/monitoring-dashboard/data-access-monitoring-dashboard';
import { SharedMonitoringDashboardUiDataSyncStatisticsModule } from '@poss-web/shared/monitoring-dashboard/ui-data-sync-statistics';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedMonitoringDashboardUiUpdateSchedulerTimeModule } from '@poss-web/shared/monitoring-dashboard/ui-update-scheduler-time';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';

const routes: Routes = [
  {
    path: '',
    component: MonitoringDashboardComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedMonitoringDashboardUiScheduledJobsListingModule,
    SharedMonitoringDashboardUiManualTriggerDataSyncModule,
    SharedComponentsUiLoaderModule,
    SharedMonitoringDashboardDataAccessMonitoringDashboardModule,
    SharedMonitoringDashboardUiDataSyncStatisticsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedPermissionUiPermissionModule,
    SharedMonitoringDashboardUiUpdateSchedulerTimeModule
  ],
  declarations: [MonitoringDashboardComponent]
})
export class SharedMonitoringDashboardFeatureMonitoringDashboardModule {}
