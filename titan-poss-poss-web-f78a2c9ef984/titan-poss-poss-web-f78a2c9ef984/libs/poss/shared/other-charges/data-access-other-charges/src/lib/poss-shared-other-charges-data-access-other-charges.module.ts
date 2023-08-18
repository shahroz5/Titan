import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OtherChargesFeatureKey,
  OtherChargesReducer
} from './+state/other-charges.reducer';
import { OtherChargesEffects } from './+state/other-charges.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OtherChargesService } from './other-charges.service';
import { OtherChargesFacade } from './+state/other-charges.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(OtherChargesFeatureKey, OtherChargesReducer),
    EffectsModule.forFeature([OtherChargesEffects])
  ],
  providers: [OtherChargesFacade, OtherChargesService]
})
export class PossSharedOtherChargesDataAccessOtherChargesModule {}
