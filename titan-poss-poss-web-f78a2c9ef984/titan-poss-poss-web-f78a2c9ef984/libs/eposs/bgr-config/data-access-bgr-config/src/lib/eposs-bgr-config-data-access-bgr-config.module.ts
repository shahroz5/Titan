import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';


import { BgrConfigService } from './bgr-config.service';
import {
  BGR_CONFIG_FEATURE_KEY,
  BgrConfigReducer
} from './+state/bgr-config.reducer';
import { BgrConfigFacade } from './+state/bgr-config.facade';
import { BgrConfigEffects } from './+state/bgr-config.effects';

@NgModule({
  imports: [
    CommonModule,
    // SharedUtilApiServiceModule,
    StoreModule.forFeature(BGR_CONFIG_FEATURE_KEY, BgrConfigReducer),
    EffectsModule.forFeature([BgrConfigEffects])
  ],
  providers: [BgrConfigFacade, BgrConfigService]
})
export class EpossBgrConfigDataAccessBgrConfigModule {}
