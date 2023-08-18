import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { GSTMappingListComponent } from './gst-mapping-list.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [GSTMappingListComponent],
  exports: [GSTMappingListComponent]
})
export class EpossGstMappingUiGstMappingListModule {}
