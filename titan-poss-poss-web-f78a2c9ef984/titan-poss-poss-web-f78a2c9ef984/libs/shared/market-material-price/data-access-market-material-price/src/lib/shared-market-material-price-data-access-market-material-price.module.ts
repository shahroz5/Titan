import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MARKET_MATERIAL_PRICE_FEATURE_KEY,
  marketMaterialPriceReducer
} from './+state/market-material-price.reducer';
import { MarketMaterialPriceEffects } from './+state/market-material-price.effects';
import { MarketMaterialPriceFacade } from './+state/market-material-price.facade';
import { MaterialPriceService } from './material-price.service';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      MARKET_MATERIAL_PRICE_FEATURE_KEY,
      marketMaterialPriceReducer
    ),
    EffectsModule.forFeature([MarketMaterialPriceEffects])
  ],
  providers: [MarketMaterialPriceFacade, MaterialPriceService]
})
export class SharedMarketMaterialPriceDataAccessMarketMaterialPriceModule {}
