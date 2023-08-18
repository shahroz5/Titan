
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GepEffects } from './+state/gep.effects';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { GEP_FEATURE_KEY, GepReducer } from './+state/gep.reducer';
import { EffectsModule } from '@ngrx/effects';
import { GepFacade } from './+state/gep.facade';
import { GepService } from './gep.service';

@NgModule({
  imports: [CommonModule, SharedUtilApiServiceModule,
    StoreModule.forFeature(GEP_FEATURE_KEY, GepReducer),
      EffectsModule.forFeature([GepEffects])
    ],

  providers: [GepFacade,  GepService],

})
export class PossGepDataAccessGepModule {}
