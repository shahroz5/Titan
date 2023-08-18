import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AdvanceHistoryItemListingComponent } from './advance-history-item-listing/advance-history-item-listing.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [AdvanceHistoryItemListingComponent],
  exports: [AdvanceHistoryItemListingComponent]
})
export class PossCtAdvanceUiAdvanceHistoryItemListingModule {}
