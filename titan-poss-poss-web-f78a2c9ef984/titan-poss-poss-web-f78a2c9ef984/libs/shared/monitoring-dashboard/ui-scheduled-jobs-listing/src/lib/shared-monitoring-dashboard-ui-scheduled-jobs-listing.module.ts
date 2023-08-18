import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduledJobsListingComponent } from './scheduled-jobs-listing/scheduled-jobs-listing.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [ScheduledJobsListingComponent],
  exports: [ScheduledJobsListingComponent]
})
export class SharedMonitoringDashboardUiScheduledJobsListingModule {}
