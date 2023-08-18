import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { giftCardsFeatureKey, GiftCardsReducer } from './+state/gift-cards.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GiftCardsEffects } from './+state/gift-cards.effects';
import { GiftCardsFacade } from './+state/gift-cards.facade';
import { GiftCardsService } from './gift-cards.service';

@NgModule({
  imports: [CommonModule,
    StoreModule.forFeature(
      giftCardsFeatureKey,
      GiftCardsReducer
    ),
    EffectsModule.forFeature([GiftCardsEffects])
  ],
  providers: [GiftCardsFacade, GiftCardsService]
})

export class PossGiftCardsDataAccessGiftCardsModule {}
