import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BodEodEffects } from './+state/bod-eod.effects';
import { SharedBodEodFacade } from './+state/bod-eod.facade';
import { bodEodFeatureKey, BodEodReducer } from './+state/bod-eod.reducer';
import { BodEodService } from './bod-eod.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(bodEodFeatureKey, BodEodReducer),
    EffectsModule.forFeature([BodEodEffects])
  ],
  providers: [SharedBodEodFacade, BodEodService]
})
export class SharedBodEodDataAccessBodEodModule {}
