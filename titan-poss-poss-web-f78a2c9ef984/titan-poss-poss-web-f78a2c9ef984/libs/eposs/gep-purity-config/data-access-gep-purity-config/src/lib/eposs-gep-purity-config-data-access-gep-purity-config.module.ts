import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { GEPPurityConfigEffects } from './+state/gep-purity-config.effects';
import { GEPPurityConfigFacade } from './+state/gep-purity-config.facade';
import {
  GEPPurityConfigReducer, GEP_PURITY_CONFIGURATION_KEY
} from './+state/gep-purity-config.reducer';
import { GEPPurityConfigService } from './gep-purity-config.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      GEP_PURITY_CONFIGURATION_KEY,
      GEPPurityConfigReducer
    ),
    EffectsModule.forFeature([GEPPurityConfigEffects])
  ],
  providers: [GEPPurityConfigFacade, GEPPurityConfigService]
})
export class EpossGepPurityConfigDataAccessGepPurityConfigModule {}
