import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { TepReducer, tepFeatureKey } from './+state/direct-tep.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TepEffects } from './+state/direct-tep.effects';
import { TepFacade } from './+state/direct-tep.facade';
import { TepService } from './direct-tep.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(tepFeatureKey, TepReducer),
    EffectsModule.forFeature([TepEffects])
  ],
  providers: [TepFacade, TepService]
})
export class SharedTepDataAccessDirectTepModule {}
