import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { CtGrfReducer, ctGrfFeatureKey } from './+state/grf.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CtGrfEffects } from './+state/grf.effects';
import { CtGrfFacade } from './+state/grf.facade';
import { CtGrfService } from './grf.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(ctGrfFeatureKey, CtGrfReducer),
    EffectsModule.forFeature([CtGrfEffects])
  ],
  providers: [CtGrfFacade, CtGrfService]
})
export class PossGrfDataAccessGrfModule {}
