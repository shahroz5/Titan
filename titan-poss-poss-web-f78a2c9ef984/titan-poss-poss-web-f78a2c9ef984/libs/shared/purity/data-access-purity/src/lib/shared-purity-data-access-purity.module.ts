import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurityFacade } from './+state/purity.facade';
import { PurityService } from './purity.service';
import { PURITY_FEATURE_NAME, purityReducers } from './+state/purity.reducers';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PurityEffects } from './+state/purity.effects';

@NgModule({
  imports: [CommonModule,
    StoreModule.forFeature(PURITY_FEATURE_NAME, purityReducers),
    EffectsModule.forFeature([PurityEffects])],

  providers: [PurityFacade, PurityService]
})
export class SharedPurityDataAccessPurityModule { }
