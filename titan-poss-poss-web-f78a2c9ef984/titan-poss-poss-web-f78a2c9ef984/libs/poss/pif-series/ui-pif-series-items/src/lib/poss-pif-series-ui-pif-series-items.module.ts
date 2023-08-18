import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PifSeriesItemsComponent } from './pif-series-items/pif-series-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [PifSeriesItemsComponent],
  exports: [PifSeriesItemsComponent]
})
export class PossPifSeriesUiPifSeriesItemsModule {}
