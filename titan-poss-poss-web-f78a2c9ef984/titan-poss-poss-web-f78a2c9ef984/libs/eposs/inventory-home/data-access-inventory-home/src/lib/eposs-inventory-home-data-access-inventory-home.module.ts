import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { InventoryHomeEffects } from './+state/inventory-home.effect';
import {
  inventoryHomeReducer,
  inventoryHomeFeatureKey
} from './+state/inventory-home.reducer';
import { InventoryHomeFacade } from './+state/inventory-home.facade';
import { InventoryHomeService } from './inventory-home.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(inventoryHomeFeatureKey, inventoryHomeReducer),
    EffectsModule.forFeature([InventoryHomeEffects])
  ],
  providers: [InventoryHomeFacade, InventoryHomeService]
})
export class EpossInventoryHomeDataAccessInventoryHomeModule {}
