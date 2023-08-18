import { Component } from '@angular/core';
import { MonitoringDashboardEnum } from '@poss-web/shared/models';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'poss-web-manual-run-job',
  templateUrl: './manual-run-job.component.html'
})
export class ManualRunJobComponent implements ICellRendererAngularComp {
  params: any;
  showManualRunButton = false;
  buttonName = MonitoringDashboardEnum.MANUAL_RUN;

  agInit(params: any) {
    this.params = params;
    if (!!params.data) {
      // Test the tabType dependence for Scheduler, check for both Scheduler & DataSync
      if (
        !!params.data.tabType &&
        params.data.tabType === MonitoringDashboardEnum.SCHEDULER
      ) {
        this.showManualRunButton = true;
        if (
          !!params.data.buttonName &&
          params.data.buttonName === MonitoringDashboardEnum.MANUAL_RUN &&
          !params.data.isActive
        ) {
          this.showManualRunButton = false;
        }
      }
      // else if (!!params.data.destination) {
      // else {
      if (
        params.data.dataflowDirection === 'IN' &&
        (params.data.status === 'RECEIVED' ||
          params.data.status === 'FAILED_DEPENDENCY' ||
          params.data.status === 'FAILED_PERSIST')
      ) {
        this.showManualRunButton = true;
      } else if (
        params.data.dataflowDirection === 'OUT' &&
        (params.data.status === 'SAVED' || params.data.status === 'IN_QUEUE')
      ) {
        this.showManualRunButton = true;
      } else {
        this.showManualRunButton = false;
      }
      // }
      if (!!params.data.buttonName) {
        this.buttonName = params.data.buttonName;
      }
    }
    console.log(
      `In agInit dataflowDirection-status-showManualRunButton-tabType: ${params.data.dataflowDirection}-${params.data.status}-${this.showManualRunButton}-${params.data.tabType}`
    );
  }

  manualRun() {
    this.params.context.componentParent?.manualRunJob(this.params.data);
  }
  refresh(): boolean {
    return true;
  }
}
