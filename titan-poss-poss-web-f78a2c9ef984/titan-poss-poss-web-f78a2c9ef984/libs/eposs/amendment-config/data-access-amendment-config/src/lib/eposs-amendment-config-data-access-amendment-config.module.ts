import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import {
  amendmentConfigFeatureKey,
  AmendmentConfigReducer
} from './+state/amendment-config.reducer';
import { AmendmentConfigService } from './amendment-config.service';
import { InventoryGlobalConfigEffect } from './+state/amendment-config.effect';
import { AmendmentConfigFacade } from './+state/amendment-config.facade';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(amendmentConfigFeatureKey, AmendmentConfigReducer),
    EffectsModule.forFeature([InventoryGlobalConfigEffect])
  ],
  providers: [AmendmentConfigFacade, AmendmentConfigService]
})
export class EpossAmendmentConfigDataAccessAmendmentConfigModule {}
