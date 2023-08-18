import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { TepRequestFeatureKey, TEPRequestReducer } from './+state/tep.reducer';
import { TEPRequestEffects } from './+state/tep.effects';
import { TEPRequestFacade } from './+state/tep.facade';
import { TEPService } from './tep.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(TepRequestFeatureKey, TEPRequestReducer),
    EffectsModule.forFeature([TEPRequestEffects])
  ],
  providers: [TEPRequestFacade, TEPService]
})
export class PossTepDataAccessTepModule {}
