import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManualTriggerDataSyncComponent } from './manual-trigger-data-sync/manual-trigger-data-sync.component';
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
  declarations: [ManualTriggerDataSyncComponent],
  exports: [ManualTriggerDataSyncComponent]
})
export class SharedMonitoringDashboardUiManualTriggerDataSyncModule {}
