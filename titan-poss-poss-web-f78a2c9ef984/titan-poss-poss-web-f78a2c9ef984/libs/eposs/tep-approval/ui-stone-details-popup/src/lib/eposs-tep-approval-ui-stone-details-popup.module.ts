import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoneDetailsPopupComponent } from './stone-details-popup/stone-details-popup.component';
import { SharedTepUiTepStoneDetailsListGridModule } from '@poss-web/shared/tep/ui-tep-stone-details-list-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedTepUiTepStoneDetailsListGridModule
  ],
  declarations: [StoneDetailsPopupComponent],
  entryComponents: [StoneDetailsPopupComponent]
})
export class EpossTepApprovalUiStoneDetailsPopupModule {}
