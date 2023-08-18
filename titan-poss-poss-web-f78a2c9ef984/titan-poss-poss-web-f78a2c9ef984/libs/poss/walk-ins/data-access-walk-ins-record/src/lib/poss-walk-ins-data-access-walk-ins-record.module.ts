import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { WalkInsRecordReducer } from './+state/walk-ins-record.reducer';
import { EffectsModule } from '@ngrx/effects';
import { WalkInsRecordEffects } from './+state/walk-ins-record.effects';
import { WalkInsRecordFacade } from './+state/walk-ins-record.facade';
import { WalkInsRecordService } from './walk-ins-record.service';
import { walkInRecordFeatureKey } from './+state/walk-ins-record.state';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(walkInRecordFeatureKey, WalkInsRecordReducer),
    EffectsModule.forFeature([WalkInsRecordEffects])
  ],
  providers: [WalkInsRecordFacade, WalkInsRecordService]
})
export class PossWalkInsDataAccessWalkInsRecordModule {}
