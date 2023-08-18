import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

import { GrfHistoryItemListingComponent } from './grf-history-item-listing/grf-history-item-listing.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [GrfHistoryItemListingComponent],
  exports: [GrfHistoryItemListingComponent]
})
export class PossGrfUiGrfHistoryItemListingModule {}
