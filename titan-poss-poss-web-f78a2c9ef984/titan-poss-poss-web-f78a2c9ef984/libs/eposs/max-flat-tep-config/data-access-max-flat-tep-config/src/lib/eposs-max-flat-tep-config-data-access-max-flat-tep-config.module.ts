import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {
  MaxFlatTepConfigReducer,
  maxFlatTepConfigFeatureKey
} from './+state/max-flat-tep-config.reducer';
import { EffectsModule } from '@ngrx/effects';
import { MaxFlatTepConfigEffects } from './+state/max-flat-tep-config.effects';
import { MaxFlatTepConfigFacade } from './+state/max-flat-tep-config.facade';
import { MaxFlatTepConfigService } from './max-flat-tep-config.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(maxFlatTepConfigFeatureKey, MaxFlatTepConfigReducer),
    EffectsModule.forFeature([MaxFlatTepConfigEffects])
  ],
  providers: [MaxFlatTepConfigFacade, MaxFlatTepConfigService]
})
export class EpossMaxFlatTepConfigDataAccessMaxFlatTepConfigModule {}
