import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGiftCardsUiGiftCardsCmListModule } from '@poss-web/poss/gift-cards/ui-gift-cards-cm-list';
import { CmListGridPopUpComponent } from './cm-list-grid-pop-up/cm-list-grid-pop-up.component';

@NgModule({
  imports: [CommonModule,
    CommonCustomMaterialModule,
    PossGiftCardsUiGiftCardsCmListModule],
  declarations: [CmListGridPopUpComponent],
  entryComponents: [CmListGridPopUpComponent]
})
export class PossGiftCardsUiCmListGridPopUpModule {}
