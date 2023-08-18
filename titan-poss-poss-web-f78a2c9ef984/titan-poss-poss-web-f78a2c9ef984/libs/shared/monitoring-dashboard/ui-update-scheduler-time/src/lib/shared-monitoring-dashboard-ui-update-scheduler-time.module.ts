import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateSchedulerTimeComponent } from './update-scheduler-time/update-scheduler-time.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [UpdateSchedulerTimeComponent],
  exports: [UpdateSchedulerTimeComponent]
})
export class SharedMonitoringDashboardUiUpdateSchedulerTimeModule {}
