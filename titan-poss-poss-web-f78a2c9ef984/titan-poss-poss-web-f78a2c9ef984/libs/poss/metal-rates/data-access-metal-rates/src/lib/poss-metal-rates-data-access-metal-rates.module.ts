import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { MetalRatesReducer } from './+state/metal-rates.reducer';
import { EffectsModule } from '@ngrx/effects';
import { MetalRatesEffects } from './+state/metal-rates.effects';
import { MetalRatesFacade } from './+state/metal-rates.facade';
import { MetalRatesService } from './metal-rates.service';
import { metalRatesFeatureKey } from './+state/metal-rates.state';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(metalRatesFeatureKey, MetalRatesReducer),
    EffectsModule.forFeature([MetalRatesEffects])
  ],
  providers: [MetalRatesFacade, MetalRatesService]
})
export class PossMetalRatesDataAccessMetalRatesModule {}
