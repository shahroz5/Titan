import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateFacade } from './+state/state.facade';
import { StateEffect } from './+state/state.effect';
import { StateService } from './state.service';
import { StoreModule } from '@ngrx/store';
import { STATE_FEATURE_KEY, stateReducer } from './+state/state.reducer';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(STATE_FEATURE_KEY, stateReducer),
    EffectsModule.forFeature([StateEffect])
  ],
  providers: [StateFacade, StateService]
})
export class SharedStateDataAccessStateModule {}
