import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvanceBookingFacade } from './+state/advance-booking.facade';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  advanceBookingFeatureKey,
  advanceBookingReducer
} from './+state/advance-booking.reducer';
import { AdvanceBookingEffects } from './+state/advance-booking.effects';
import { AdvanceBookingService } from './advance-booking.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(advanceBookingFeatureKey, advanceBookingReducer),
    EffectsModule.forFeature([AdvanceBookingEffects])
  ],
  providers: [AdvanceBookingFacade, AdvanceBookingService]
})
export class PossAdvanceBookingDataAccessAdvanceBookingModule {

}
