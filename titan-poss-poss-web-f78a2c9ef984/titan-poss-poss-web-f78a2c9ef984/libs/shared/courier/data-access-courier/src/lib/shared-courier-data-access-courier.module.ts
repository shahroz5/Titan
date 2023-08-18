import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import {
  CourierDetailsReducer,
  COURIER_DETAILS_FEATURE_KEY
} from './+state/courier-details.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CourierDetailsEffects } from './+state/courier-details.effect';
import { CourierDetailsFacade } from './+state/courier-details.facade';
import { CourierDetailsService } from './courier-details.service';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(COURIER_DETAILS_FEATURE_KEY, CourierDetailsReducer),
    EffectsModule.forFeature([CourierDetailsEffects])
  ],
  providers: [CourierDetailsFacade, CourierDetailsService]
})
export class SharedCourierDataAccessCourierModule {}
