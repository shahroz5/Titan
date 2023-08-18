import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSyncStatisticsComponent } from './data-sync-statistics/data-sync-statistics.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiSelectionDialogModule
  ],
  declarations: [DataSyncStatisticsComponent],
  exports: [DataSyncStatisticsComponent]
})
export class SharedMonitoringDashboardUiDataSyncStatisticsModule {}
