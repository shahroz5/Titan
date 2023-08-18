import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  DiscountReducer,
  DISCOUNT_FEATURE_KEY
} from './+state/discount.reducer';
import { DiscountEffect } from './+state/discount.effect';
import { DiscountFacade } from './+state/discount.facade';
import { DiscountService } from './discount.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(DISCOUNT_FEATURE_KEY, DiscountReducer),
    EffectsModule.forFeature([DiscountEffect])
  ],
  providers: [DiscountFacade, DiscountService]
})
export class PossSharedDiscountDataAccessDiscountModule {}
