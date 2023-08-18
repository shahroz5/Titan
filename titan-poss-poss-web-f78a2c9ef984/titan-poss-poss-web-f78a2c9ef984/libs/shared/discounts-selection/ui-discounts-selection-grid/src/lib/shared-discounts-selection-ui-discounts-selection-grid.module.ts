import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { DiscountsSelectionGridComponent } from './discounts-selection-grid/discounts-selection-grid.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [DiscountsSelectionGridComponent],
  exports: [DiscountsSelectionGridComponent]
})
export class SharedDiscountsSelectionUiDiscountsSelectionGridModule {}
