import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { AdvanceHistoryListPopUpComponent } from './advance-history-list-pop-up/advance-history-list-pop-up.component';
import { PossCtAdvanceUiAdvanceHistoryItemListingModule } from '@poss-web/poss/ct-advance/ui-advance-history-item-listing';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossCtAdvanceUiAdvanceHistoryItemListingModule
  ],
  declarations: [AdvanceHistoryListPopUpComponent],
  entryComponents: [AdvanceHistoryListPopUpComponent]
})
export class PossCtAdvanceUiAdvanceHistoryListPopUpModule {}
