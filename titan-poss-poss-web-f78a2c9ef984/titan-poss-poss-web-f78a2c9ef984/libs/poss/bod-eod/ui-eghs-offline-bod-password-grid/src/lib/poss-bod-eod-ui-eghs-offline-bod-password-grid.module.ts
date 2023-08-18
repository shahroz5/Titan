import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { AgEghsOfflineBodPasswordGridComponent } from './ag-eghs-offline-bod-password-grid/ag-eghs-offline-bod-password-grid.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [AgEghsOfflineBodPasswordGridComponent],
  exports: [AgEghsOfflineBodPasswordGridComponent]
})
export class PossBodEodUiEghsOfflineBodPasswordGridModule {}
