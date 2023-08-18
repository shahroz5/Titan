import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossGiftCardsDataAccessGiftCardsModule } from '@poss-web/poss/gift-cards/data-access-gift-cards';
import { PossGiftCardsUiGiftCardsGridModule } from '@poss-web/poss/gift-cards/ui-gift-cards-grid';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { GiftCardsHistoryDetailsComponent } from './gift-cards-history-details/gift-cards-history-details.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    PossGiftCardsDataAccessGiftCardsModule,
    PossGiftCardsUiGiftCardsGridModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [GiftCardsHistoryDetailsComponent],
  exports: [GiftCardsHistoryDetailsComponent]
})
export class PossGiftCardsFeatureGiftCardsHistoryDetailsModule {}
