import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftCardsHistoryComponent } from './gift-cards-history/gift-cards-history.component';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PossGiftCardsUiGcHistoryItemListingModule } from '@poss-web/poss/gift-cards/ui-gc-history-item-listing';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    RouterModule.forChild([{ path: '', component: GiftCardsHistoryComponent }]),
    PossGiftCardsUiGcHistoryItemListingModule
  ],
  declarations: [GiftCardsHistoryComponent]
})
export class PossGiftCardsFeatureGiftCardsHistoryModule {}
