import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  tepStoneConfigReducer,
  TEP_STONE_CONFIG_FEATURE_NAME
} from './+state/tep-stone-config.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TepStoneConfigEffect } from './+state/tep-stone-config.effect';
import { TepStoneConfigFacade } from './+state/tep-stone-config.facade';
import { TepStoneConfigService } from './tep-stone-config.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      TEP_STONE_CONFIG_FEATURE_NAME,
      tepStoneConfigReducer
    ),
    EffectsModule.forFeature([TepStoneConfigEffect])
  ],
  providers: [TepStoneConfigFacade, TepStoneConfigService]
})
export class EpossTepStoneConfigDataAccessTepStoneConfigModule {}
