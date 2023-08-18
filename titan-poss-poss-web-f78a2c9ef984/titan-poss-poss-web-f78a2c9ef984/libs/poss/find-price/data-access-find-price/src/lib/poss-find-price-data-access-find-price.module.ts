import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FindPriceEffects } from './+state/find-price.effects';
import { findPriceReducer } from './+state/find-price.reducer';
import { findPriceFeatureKey } from './+state/find-price.state';
import { FindPriceFacade } from './+state/find-price.facade';
import { FindPriceService } from './find-price.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(findPriceFeatureKey, findPriceReducer),
    EffectsModule.forFeature([FindPriceEffects]),
  ],
  providers: [FindPriceFacade, FindPriceService]
})
export class PossFindPriceDataAccessFindPriceModule {}