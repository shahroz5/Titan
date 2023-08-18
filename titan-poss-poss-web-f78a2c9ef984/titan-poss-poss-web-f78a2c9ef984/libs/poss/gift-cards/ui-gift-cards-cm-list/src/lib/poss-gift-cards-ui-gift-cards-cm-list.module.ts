import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { GiftCardsCmListComponent } from './gift-cards-cm-list/gift-cards-cm-list.component';

@NgModule({
  imports: [CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule],
  declarations: [GiftCardsCmListComponent],
  exports: [GiftCardsCmListComponent]
})
export class PossGiftCardsUiGiftCardsCmListModule { }
