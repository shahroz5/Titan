import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  MarketCodeReducer,
  MARKET_CODE_FEATURE_KEY
} from './+state/market-code.reducer';
import { MarketCodeEffects } from './+state/market-code.effects';
import { MarketCodeService } from './market-code.service';
import { MarketCodeFacade } from './+state/market-code.facade';
@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(MARKET_CODE_FEATURE_KEY, MarketCodeReducer),
    EffectsModule.forFeature([MarketCodeEffects])
  ],
  providers: [MarketCodeService, MarketCodeFacade]
})
export class SharedMarketCodeDataAccessMarketCodeModule {}
