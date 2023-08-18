import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import {
  invglobalConfigurationFeatureKey,
  invglobalConfigurationReducer
} from './+state/inventory-global-config.reducer';
import { InventoryGlobalConfigService } from './inventory-global-config.service';
import { InventoryGlobalConfigEffect } from './+state/inventory-global-config.effect';
import { InventoryGlobalConfigFacade } from './+state/inventory-global-config.facade';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      invglobalConfigurationFeatureKey,
      invglobalConfigurationReducer
    ),
    EffectsModule.forFeature([InventoryGlobalConfigEffect])
  ],
  providers: [InventoryGlobalConfigFacade, InventoryGlobalConfigService]
})
export class EpossInventoryGlobalConfigDataAccessInvGlobalConfigModule {}
