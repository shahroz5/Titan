import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { InterBoutiqueTransferEffects } from './+state/inter-boutique-transfer.effect';
import {
  ibtFeatureKey,
  interBoutiqueTransferReducer
} from './+state/inter-boutique-transfer.reducer';
import { InterBoutiqueTransferFacade } from './+state/inter-boutique-transfer.facade';
import { InterBoutiqueTransferService } from './inter-boutique-transfer.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(ibtFeatureKey, interBoutiqueTransferReducer),
    EffectsModule.forFeature([InterBoutiqueTransferEffects])
  ],
  providers: [InterBoutiqueTransferFacade, InterBoutiqueTransferService]
})
export class EpossIbtDataAccessIbtModule {}
