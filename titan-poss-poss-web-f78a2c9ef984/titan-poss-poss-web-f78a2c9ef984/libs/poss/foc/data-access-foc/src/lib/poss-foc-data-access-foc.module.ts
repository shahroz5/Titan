import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { EffectsModule } from '@ngrx/effects';
import { FocEffects } from './+state/foc.effects';
import { FocReducer, FOC_FEATURE_KEY } from './+state/foc.reducer';
import { FocFacade } from './+state/foc.facade';
import { FocService } from './foc.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(FOC_FEATURE_KEY, FocReducer),
    EffectsModule.forFeature([FocEffects])
  ],
  providers: [FocFacade, FocService]
})
export class PossFocDataAccessFocModule {}
