import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeDetailsItemComponent } from './range-details-item/range-details-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AgGridModule } from 'ag-grid-angular';
import { DeleteRowComponent } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    AgGridModule.withComponents([DeleteRowComponent])
  ],
  declarations: [RangeDetailsItemComponent],
  exports: [RangeDetailsItemComponent]
})
export class EpossRangeUiRangeDetailsModule {}
